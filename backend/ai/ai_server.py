from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# load models
candidate_model = joblib.load("candidate_model.pkl")
candidate_scaler = joblib.load("scaler_candidate.pkl")

forecast_model = joblib.load("forecast_model.pkl")
forecast_scaler = joblib.load("scaler_forecast.pkl")


# ---------- Skill Matching ----------
def skill_similarity(a, j):
    a = set([s.strip().lower() for s in a])
    j = set([s.strip().lower() for s in j])
    return len(a & j)/len(j) if len(j)>0 else 0
# ------------------------------------


# ---------- Candidate Prediction ----------
@app.route("/predict_candidate", methods=["POST"])
def predict_candidate():

    d = request.json

    skill_score = skill_similarity(
        d["applicant_skills"],
        d["job_skills"]
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

    X = candidate_scaler.transform(X)

    prob = candidate_model.predict_proba(X)[0][1]

    return jsonify({
        "score": float(prob),
        "skill_score": float(skill_score)
    })


# ---------- TOP-5 RANKING ----------
@app.route("/rank_candidates", methods=["POST"])
def rank_candidates():

    data = request.json
    results = []

    for c in data:

        skill_score = skill_similarity(
            c["applicant_skills"],
            c["job_skills"]
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

        X = candidate_scaler.transform(X)

        prob = candidate_model.predict_proba(X)[0][1]

        results.append({
            "applicant_id": c["applicant_id"],
            "score": float(prob)
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return jsonify(results[:5])


# ---------- FORECAST ----------
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

    X = forecast_scaler.transform(X)

    pred = forecast_model.predict(X)[0]

    return jsonify({
        "required_staff": int(pred)
    })

if __name__ == '__main__':
    app.run(port=5001)
