# from fastapi import FastAPI
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List, Dict, Any, Optional

# # Import the model instance from app/model.py
# from app.model import model

# # Initialize FastAPI app
# app = FastAPI(
#     title="MediBot API",
#     description="An API to predict diseases based on symptoms.",
#     version="1.0.0"
# )

# # Enable CORS (Allows React Frontend to talk to this Backend)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Input Structure
# class SymptomsInput(BaseModel):
#     symptoms: List[str]

# # Output Structure
# class PredictionResponse(BaseModel):
#     predictions: List[Dict[str, Any]]
#     error: Optional[str] = None

# @app.get("/")
# def read_root():
#     return {"status": "ok", "message": "MediBot API is running."}

# @app.post("/predict", response_model=PredictionResponse)
# def predict_disease(symptom_data: SymptomsInput):
#     """
#     Receives symptoms, processes them, and returns predictions.
#     Ensures frontend never crashes by always returning a list for 'predictions'.
#     """
    
#     # Get result from model
#     result = model.predict(symptom_data.symptoms)

#     # Check if the model returned an error dictionary
#     if isinstance(result, dict) and "error" in result:
#         # ERROR CASE: 
#         # Return empty predictions list so React .map() doesn't break.
#         # Pass the error message so React can display a warning if you want.
#         return {
#             "predictions": [], 
#             "error": result["message"]
#         }

#     #  SUCCESS CASE:
#     # Return the predictions list.
#     return {
#         "predictions": result,
#         "error": None
#     }
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

# --- Keep-Alive Imports ---
import uvicorn
import threading
import time
import requests 
import logging
import os  # Added to read the URL directly from environment variables

# Import the model instance from app/model.py
from app.model import model

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Keep-Alive Functions ---
def heartbeat_ping():
    # READ THIS: On Render, add an Environment Variable named RENDER_EXTERNAL_URL
    # with your backend URL (e.g., https://medibot-backend.onrender.com)
    url = os.getenv("RENDER_EXTERNAL_URL")
    
    if not url:
        logger.warning("RENDER_EXTERNAL_URL environment variable not set. Keep-Alive thread stopped.")
        return

    # Ping every 8 minutes
    interval_seconds = 8 * 60 

    while True:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                logger.info(f"Keep-Alive successful. Status: {response.status_code}")
            else:
                logger.warning(f"Keep-Alive ping responded with status: {response.status_code}")
        except Exception as e:
            logger.error(f"Keep-Alive error: {e}")
        
        time.sleep(interval_seconds)

def start_keep_alive_thread():
    logger.info("Starting Keep-Alive background thread...")
    thread = threading.Thread(target=heartbeat_ping, daemon=True)
    thread.start()

# Initialize FastAPI app
app = FastAPI(
    title="MediBot API",
    description="An API to predict diseases based on symptoms.",
    version="1.0.0"
)

# Keep-Alive Trigger on Startup
@app.on_event("startup")
async def startup_event():
    start_keep_alive_thread()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input/Output Models
class SymptomsInput(BaseModel):
    symptoms: List[str]

class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    error: Optional[str] = None

@app.get("/")
def read_root():
    return {"status": "ok", "message": "MediBot API is running."}

@app.post("/predict", response_model=PredictionResponse)
def predict_disease(symptom_data: SymptomsInput):
    result = model.predict(symptom_data.symptoms)
    if isinstance(result, dict) and "error" in result:
        return {"predictions": [], "error": result["message"]}
    return {"predictions": result, "error": None}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
