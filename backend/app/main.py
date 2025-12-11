from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

# Import the model instance from app/model.py
from app.model import model

# Initialize FastAPI app
app = FastAPI(
    title="MediBot API",
    description="An API to predict diseases based on symptoms.",
    version="1.0.0"
)

# Enable CORS (Allows React Frontend to talk to this Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input Structure
class SymptomsInput(BaseModel):
    symptoms: List[str]

# Output Structure
class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    error: Optional[str] = None

@app.get("/")
def read_root():
    return {"status": "ok", "message": "MediBot API is running."}

@app.post("/predict", response_model=PredictionResponse)
def predict_disease(symptom_data: SymptomsInput):
    """
    Receives symptoms, processes them, and returns predictions.
    Ensures frontend never crashes by always returning a list for 'predictions'.
    """
    
    # Get result from model
    result = model.predict(symptom_data.symptoms)

    # Check if the model returned an error dictionary
    if isinstance(result, dict) and "error" in result:
        # ERROR CASE: 
        # Return empty predictions list so React .map() doesn't break.
        # Pass the error message so React can display a warning if you want.
        return {
            "predictions": [], 
            "error": result["message"]
        }

    #  SUCCESS CASE:
    # Return the predictions list.
    return {
        "predictions": result,
        "error": None
    }