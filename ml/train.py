# --- VERY FIRST LINE OF THE SCRIPT ---
print("--- Starting script 'train.py'... ---")
print("--> Importing libraries...")
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
from pathlib import Path
import sys
print("    - Libraries imported successfully.")

def train_model():
    """
    Loads data, trains the model, and saves artifacts.
    Paths are corrected for the new project structure.
    """
    try:
        # --- DEFINE FILE PATHS ---
        # BASE_DIR is the root 'MediBot' folder
        BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
        DATA_DIR = BASE_DIR / "data"
        # The trained model will be saved inside the 'ml' folder
        MODEL_DIR = BASE_DIR / "ml" / "saved_model"
        
        print(f"\n--> Base directory: {BASE_DIR}")
        print(f"--> Data directory: {DATA_DIR}")
        print(f"--> Model will be saved in: {MODEL_DIR}")

        # Create the model directory if it doesn't exist
        MODEL_DIR.mkdir(parents=True, exist_ok=True)

        # --- 1. Load Data ---
        print("\n--> Step 1: Loading data...")
        train_df = pd.read_csv(DATA_DIR / "Training.csv")
        test_df = pd.read_csv(DATA_DIR / "Testing.csv")
        print("     Data loaded successfully.")

        # --- 2. Clean Data ---
        print("\n--> Step 2: Cleaning data...")
        if 'Unnamed: 133' in train_df.columns:
            train_df = train_df.drop('Unnamed: 133', axis=1)
            print("     Cleaned 'Unnamed: 133' column.")
        
        # --- 3. Prepare & Train Model ---
        print("\n--> Step 3: Preparing data and training model...")
        X_train = train_df.drop('prognosis', axis=1)
        y_train = train_df['prognosis']
        X_test = test_df.drop('prognosis', axis=1)
        y_test = test_df['prognosis']

        label_encoder = LabelEncoder()
        y_train_encoded = label_encoder.fit_transform(y_train)
        y_test_encoded = label_encoder.transform(y_test)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train_encoded)
        print("    Model training complete.")

        # --- 4. Evaluate Model ---
        print("\n--> Step 4: Evaluating model...")
        # Calculate training accuracy
        train_pred = model.predict(X_train)
        train_accuracy = accuracy_score(y_train_encoded, train_pred)
        print(f"    Accuracy on training data: {train_accuracy * 100:.2f}%")

        # Calculate testing accuracy
        test_pred = model.predict(X_test)
        test_accuracy = accuracy_score(y_test_encoded, test_pred)
        print(f"     Accuracy on test data: {test_accuracy * 100:.2f}%")

        # --- 5. Save Artifacts ---
        print("\n--> Step 5: Saving model artifacts...")
        joblib.dump(model, MODEL_DIR / "random_forest_model.joblib")
        joblib.dump(label_encoder, MODEL_DIR / "label_encoder.joblib")
        joblib.dump(X_train.columns.tolist(), MODEL_DIR / "symptom_columns.joblib")
        print(f"     Model, Encoder, and Columns saved successfully in '{MODEL_DIR}'")

    except Exception as e:
        print(f"\n AN UNEXPECTED ERROR OCCURRED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    train_model()
    print("\n--- Script 'train.py' finished. ---")

