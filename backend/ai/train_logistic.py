import pandas as pd
from sqlalchemy import create_engine
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib

# DB connection
engine = create_engine("mysql+pymysql://root:@localhost/tede_hrms")

df = pd.read_sql("SELECT * FROM candidate_matching_features", engine)

X = df[[
    "education_match",
    "experience_gap",
    "interview_score",
    "skill_score",
    "cgpa",
    "publications",
    "teaching_experience"
]]

y = df["hired"]

# scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# model
model = LogisticRegression()
model.fit(X_scaled, y)

# save
joblib.dump(model, "candidate_model.pkl")
joblib.dump(scaler, "scaler_candidate.pkl")

print("Candidate model ready")
