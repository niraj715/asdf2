import joblib
from sklearn.ensemble import RandomForestClassifier
from features import extract_features

data = [
    ("https://google.com", 0),
    ("https://paypal.com", 0),
    ("http://login.paypal.verify-secure.com", 1),
    ("http://192.168.0.1/login", 1),
]

X = [extract_features(url) for url, _ in data]
y = [label for _, label in data]

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

joblib.dump(model, "phishing_model.pkl")
print("✅ Model trained successfully")
