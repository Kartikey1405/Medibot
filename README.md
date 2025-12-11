# MediBot — AI-Powered Symptom Diagnosis

MediBot is a full-stack AI health assistant that analyzes user-entered symptoms and predicts the top three most likely diseases with confidence scores. The system supports natural-language inputs, typo correction, and safe backend communication to ensure accurate and stable results.

---

## Features

- AI-based disease prediction using a trained Random Forest model  
- Natural language symptom processing  
- Automatic correction of misspelled symptoms using fuzzy matching  
- Standardized API responses for safe frontend handling  
- Modern and responsive frontend built with React, TypeScript, Vite, Tailwind CSS, and shadcn-ui  
- Backend built with FastAPI, designed for high performance  
- Top-three predictions with confidence scores  

---

## Technology Stack

### Frontend
- React  
- TypeScript  
- Vite  
- Tailwind CSS  
- shadcn-ui  
- Axios  

### Backend
- FastAPI  
- Python  
- Scikit-learn  
- Pandas / NumPy  
- Joblib  

---

# Getting Started

## 1. Clone the Repository
```bash
git clone https://github.com/Kartikey1405/Medibot.git
cd Medibot

Backend Setup (FastAPI + Machine Learning)

Navigate to the backend directory:

cd backend


Create and activate virtual environment:

Windows:
python -m venv venv
.\venv\Scripts\activate

macOS / Linux:
python3 -m venv venv
source venv/bin/activate


Install dependencies:

pip install -r requirements.txt


If model files are not included, generate them:

python ml/train.py


Run the FastAPI server:

uvicorn app.main:app --reload


Backend runs at:

http://127.0.0.1:8000

Frontend Setup

Navigate to the frontend folder:

cd ../frontend


Install dependencies:

npm install


Start development server:

npm start


Frontend runs at:

http://localhost:5173

API Usage
Endpoint

POST /predict

Example Request
{
  "symptoms": ["itching", "fatigue"]
}

Example Response
{
  "predictions": [
    { "disease": "Arthritis", "confidence": 0.12 },
    { "disease": "Diabetes", "confidence": 0.08 },
    { "disease": "Migraine", "confidence": 0.07 }
  ]
}

Deployment
Frontend Deployment (Vercel)

Push your repository to GitHub

Go to https://vercel.com

Import the repository

Select the frontend folder as the project root

Deploy

Vercel automatically detects Vite and builds accordingly.

Backend Deployment (Render or Railway)

Go to https://render.com
 or https://railway.app

Create a new Web Service

Connect your GitHub repository

Choose the backend directory as the service root

Set build command:

pip install -r requirements.txt


Set start command:

uvicorn app.main:app --host 0.0.0.0 --port 10000


Deploy

Make sure to expose port 10000.

# Project Structure
MediBot/
|
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── model.py
│   ├── ml/
│   │   ├── train.py
│   │   └── saved_model/
│   ├── data/                # optional dataset
│   ├── requirements.txt
│   ├── TRAINING_*.ipynb     # optional notebooks
|
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── package-lock.json or bun.lockb
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
|
├── README.md
└── .gitignore


