from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# ──────────────────────────────────────────────
# Load trained models
# ──────────────────────────────────────────────
candidate_model  = joblib.load("candidate_model.pkl")
candidate_scaler = joblib.load("scaler_candidate.pkl")

forecast_model  = joblib.load("forecast_model.pkl")
forecast_scaler = joblib.load("scaler_forecast.pkl")


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
def skill_similarity(applicant_skills, job_skills):
    a = set(s.strip().lower() for s in applicant_skills)
    j = set(s.strip().lower() for s in job_skills)
    return len(a & j) / len(j) if j else 0


# ──────────────────────────────────────────────
# 1. Single-candidate prediction
# ──────────────────────────────────────────────
@app.route("/predict_candidate", methods=["POST"])
def predict_candidate():
    d = request.json

    skill_score = skill_similarity(
        d.get("applicant_skills", []),
        d.get("job_skills", [])
    )

    X = np.array([[
        d.get("education_match", 0),
        d.get("experience_gap", 0),
        d.get("interview_score", 0),
        skill_score,
        d.get("cgpa", 0),
        d.get("publications", 0),
        d.get("teaching_experience", 0)
    ]])
    X_scaled = candidate_scaler.transform(X)
    prob = candidate_model.predict_proba(X_scaled)[0][1]

    return jsonify({"score": float(prob), "skill_score": float(skill_score)})


# ──────────────────────────────────────────────
# 2. Batch ranking (top-N candidates for a vacancy)
# ──────────────────────────────────────────────
@app.route("/rank_candidates", methods=["POST"])
def rank_candidates():
    data = request.json
    results = []

    for c in data:
        skill_score = skill_similarity(
            c.get("applicant_skills", []),
            c.get("job_skills", [])
        )

        X = np.array([[
            c.get("education_match", 0),
            c.get("experience_gap", 0),
            c.get("interview_score", 0),
            skill_score,
            c.get("cgpa", 0),
            c.get("publications", 0),
            c.get("teaching_experience", 0)
        ]])
        X_scaled = candidate_scaler.transform(X)
        prob = candidate_model.predict_proba(X_scaled)[0][1]

        results.append({
            "applicant_id": c["applicant_id"],
            "score": float(prob),
            "skill_score": float(skill_score)
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return jsonify(results[:5])


# ──────────────────────────────────────────────
# 3. Total-staff forecast (single category)
# ──────────────────────────────────────────────
@app.route("/forecast", methods=["POST"])
def forecast():
    d = request.json
    X = np.array([[
        d["current_staff"],
        d["avg_age"],
        d["contract_staff"],
        d["low_performers"],
        d["predicted_attrition"]
    ]])
    X_scaled = forecast_scaler.transform(X)
    pred = forecast_model.predict(X_scaled)[0]
    return jsonify({"required_staff": int(round(pred))})


# ──────────────────────────────────────────────
# 4. Per-category forecast  ← NEW
#    Request body: list of category objects
#    [{ category, current_staff, avg_age, contract_staff, low_performers, predicted_attrition }, ...]
# ──────────────────────────────────────────────
@app.route("/forecast_by_category", methods=["POST"])
def forecast_by_category():
    categories = request.json   # list
    results = []

    for cat in categories:
        current = cat.get("current_staff", 0)
        avg_age = cat.get("avg_age", 38)
        contract = cat.get("contract_staff", 0)
        low_perf = cat.get("low_performers", 0)
        attrition = cat.get("predicted_attrition", 0.04)

        X = np.array([[current, avg_age, contract, low_perf, attrition]])
        X_scaled = forecast_scaler.transform(X)
        predicted = int(round(forecast_model.predict(X_scaled)[0]))

        gap = predicted - current
        # Confidence heuristic: more data per category → higher confidence (capped)
        confidence = round(min(85 + (current / 1000 * 10), 95), 1)

        results.append({
            "category":        cat["category"],
            "current_staff":   current,
            "predicted_staff": predicted,
            "gap":             gap,
            "confidence":      confidence
        })

    return jsonify(results)


if __name__ == "__main__":
    app.run(port=5001, debug=False)
