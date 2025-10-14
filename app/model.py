import joblib
import pandas as pd
import numpy as np
from pathlib import Path

class PredictionModel:
    def __init__(self):
        """
        Loads the trained model and artifacts.
        Paths are corrected to navigate from the 'app' folder to the 'ml' folder.
        """
        # --- CORRECTED FILE PATHS FOR app/model.py ---
        BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
        MODEL_DIR = BASE_DIR / "ml" / "saved_model"
        
        try:
            self.model = joblib.load(MODEL_DIR / "random_forest_model.joblib")
            self.encoder = joblib.load(MODEL_DIR / "label_encoder.joblib")
            self.columns = joblib.load(MODEL_DIR / "symptom_columns.joblib")
            print(" Backend model, encoder, and columns loaded successfully.")
        except FileNotFoundError:
            print(" Error: Model files not found. Please run `ml/train.py` first.")
            self.model = None

    def predict(self, symptoms: list):
        """
        UPDATED: Generates Top-3 predictions with confidence scores.
        Returns a list of dictionaries, matching the frontend's expectation.
        """
        if not self.model:
            return [] # Return an empty list if model isn't loaded

        # Create a binary vector from the input symptoms
        input_vector = [1 if symptom in symptoms else 0 for symptom in self.columns]
        input_df = pd.DataFrame([input_vector], columns=self.columns)

        # Get prediction probabilities for ALL diseases
        probabilities = self.model.predict_proba(input_df)[0]
        
        # Get the indices of the top 3 diseases with the highest probabilities
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        
        # Create the response list with disease names and confidence scores
        predictions = []
        for index in top_3_indices:
            disease_name = self.encoder.inverse_transform([index])[0]
            confidence_score = probabilities[index]
            predictions.append({
                "disease": disease_name,
                "confidence": confidence_score
            })
            
        return predictions

# Create a single instance of the model to be used by the API
model = PredictionModel()