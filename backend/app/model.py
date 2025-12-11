import joblib
import pandas as pd
import numpy as np
import re
from pathlib import Path
from difflib import get_close_matches

class PredictionModel:
    def __init__(self):
        """
        Loads the trained model and artifacts.
        """
        # Path setup: Assumes this file is in 'app/' and models are in 'ml/saved_model/'
        BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
        MODEL_DIR = BASE_DIR / "ml" / "saved_model"
        
        try:
            self.model = joblib.load(MODEL_DIR / "random_forest_model.joblib")
            self.encoder = joblib.load(MODEL_DIR / "label_encoder.joblib")
            self.columns = joblib.load(MODEL_DIR / "symptom_columns.joblib")
            
            # Create a dictionary for fast lookup: "headache" -> "Headache"
            # This maps lowercase column names to the exact column name required by the model
            self.col_dict = {col.lower(): col for col in self.columns}
            self.lower_columns = list(self.col_dict.keys())
            
            print(" Backend model loaded successfully.")
        except FileNotFoundError:
            print(" Error: Model files not found. Please check your paths.")
            self.model = None

    def validate_symptoms(self, raw_input_list):
        """
        Smart Validation:
        1. Joins list into a sentence (handles both comma-lists and full sentences).
        2. Scans for known symptoms (keywords).
        3. Handles 'high fever' matching 'high_fever'.
        4. Fallback to fuzzy matching for typos.
        """
        valid = []
        found_symptoms_set = set() # To prevent duplicates

        # 1. MERGE & CLEAN INPUT
        # Combine list ["I have fever", "headache"] -> "i have fever headache"
        full_text = " ".join(raw_input_list).lower()
        # Remove punctuation (commas, dots, etc.) but keep spaces and underscores
        full_text = re.sub(r'[^\w\s]', ' ', full_text)

        print(f"\n Scanning user text: '{full_text}'")

        # 2. KEYWORD SCANNING (The "Sentence" Fix)
        # We look for OUR database symptoms inside the USER'S text.
        for known_symptom in self.lower_columns:
            # Create a version with spaces instead of underscores (e.g., "high fever")
            symptom_with_space = known_symptom.replace("_", " ")

            # CHECK: Does "high_fever" OR "high fever" exist in the text as a whole word?
            # \b ensures we don't match "ache" inside "headache"
            if (re.search(r'\b' + re.escape(known_symptom) + r'\b', full_text) or 
                re.search(r'\b' + re.escape(symptom_with_space) + r'\b', full_text)):
                
                original_name = self.col_dict[known_symptom]
                # Only add if not already found
                if original_name not in found_symptoms_set:
                    valid.append(original_name)
                    found_symptoms_set.add(original_name)
                    print(f"   -> Matched keyword: {original_name}")

        # 3. TYPO CHECKING (The Fallback)
        # If the keyword scan missed something (e.g., user typed "headach"), 
        # we split the text into words and check for typos.
        words = full_text.split()
        for word in words:
            # Skip common words like "i", "am", "having" to save time
            if len(word) < 3: continue
            
            matches = get_close_matches(word, self.lower_columns, n=1, cutoff=0.85)
            if matches:
                matched = matches[0]
                original_name = self.col_dict[matched]
                if original_name not in found_symptoms_set:
                    valid.append(original_name)
                    found_symptoms_set.add(original_name)
                    print(f"   -> Fixed typo: '{word}' => '{original_name}'")

        return valid

    def predict(self, symptoms: list):
        if not self.model:
            return {"error": "Model not loaded"}

        # 1️ Validate & Extract
        valid_symptoms = self.validate_symptoms(symptoms)

        # If extraction failed entirely (e.g., input was "1" or "xyz")
        if not valid_symptoms:
            return {
                "error": "no_symptoms_found",
                "message": "I couldn't identify any specific symptoms. Please describe them clearly (e.g., 'high fever, headache').",
                "original_input": symptoms
            }

        #  Predict
        # Create input vector (all zeros except for found symptoms)
        input_vector = [1 if symptom in valid_symptoms else 0 for symptom in self.columns]
        input_df = pd.DataFrame([input_vector], columns=self.columns)

        probabilities = self.model.predict_proba(input_df)[0]
        
        # Get top 3 predictions
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        
        predictions = []
        for index in top_3_indices:
            disease_name = self.encoder.inverse_transform([index])[0]
            prob = probabilities[index]
            # Only include if probability is > 0
            if prob > 0.0:
                predictions.append({
                    "disease": disease_name,
                    "confidence": float(prob)
                })
            
        return predictions

# Create singleton instance
model = PredictionModel()