from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from features import extract_features

app = FastAPI()
model = joblib.load("phishing_model.pkl")

class URLRequest(BaseModel):
    url: str

@app.post("/analyze")
def analyze_url(data: URLRequest):
    features = extract_features(data.url)
    prediction = model.predict([features])[0]
    confidence = model.predict_proba([features])[0][prediction]

    return {
        "phishing": bool(prediction),
        "confidence": round(float(confidence), 2),
        "status": "RED" if prediction else "GREEN"
    }
