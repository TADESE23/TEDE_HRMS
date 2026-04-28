import pandas as pd
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import joblib

engine = create_engine("mysql+pymysql://root:@localhost/tede_hrms")

df = pd.read_sql("SELECT * FROM hr_forecast_features", engine)

X = df[[
    "current_staff",
    "avg_age",
    "contract_staff",
    "low_performers",
    "predicted_attrition"
]]

y = df["required_staff_next_year"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = LinearRegression()
model.fit(X_scaled, y)

joblib.dump(model, "forecast_model.pkl")
joblib.dump(scaler, "scaler_forecast.pkl")

print("Forecast model ready")
