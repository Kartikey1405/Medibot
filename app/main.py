from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

# This import works because Uvicorn runs from the root 'MediBot' directory
# It correctly imports the 'model' instance from your updated app/model.py file
from app.model import model

# Initialize the FastAPI app
app = FastAPI(
    title="MediBot API",
    description="An API to predict diseases based on symptoms.",
    version="1.0.0"
)

# --- MIDDLEWARE ---
# This allows your React frontend (running on a different port) to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API DATA MODELS (UPDATED FOR REACT) ---
# Defines the input structure from the frontend
class SymptomsInput(BaseModel):
    symptoms: List[str]

# Defines the output structure that the frontend expects
class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]

# --- API ENDPOINTS (UPDATED FOR REACT) ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the MediBot API!"}

@app.post("/predict", response_model=PredictionResponse)
def predict_disease(symptom_data: SymptomsInput):
    """
    UPDATED: Receives a list of symptoms and returns a list of prediction objects
    with disease names and confidence scores, matching the React frontend's needs.
    """
    
    prediction_list = model.predict(symptom_data.symptoms)
    # The key here is returning a dictionary with the "predictions" key
    return {"predictions": prediction_list}