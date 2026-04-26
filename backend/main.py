from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
from typing import List, Optional

from backend.utils.logger import update_memory
from backend.utils.loader import validate_and_load_csv
from backend.bias.data_bias import detect_distribution_bias, detect_intersectional_bias
from backend.models.train import train_model
from backend.bias.model_fairness import evaluate_fairness
from backend.bias.mitigation import apply_oversampling, apply_feature_removal

app = FastAPI(title="Unbiased AI Decision System")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for the current dataset
current_data = {
    "df": None,
    "filename": None,
    "target": None,
    "sensitive_columns": [],
    "audit_count": 0
}

@app.get("/stats")
async def get_stats():
    # Extract recent activities from memory.md
    memory_path = os.path.join(os.path.dirname(__file__), "memory", "memory.md")
    activities = []
    if os.path.exists(memory_path):
        with open(memory_path, "r") as f:
            lines = f.readlines()
            # Find lines starting with * followed by a space and containing :
            activities = [line.strip().split(" : ")[1] for line in lines if line.strip().startswith("* ") and " : " in line][-5:]
            activities.reverse()

    return {
        "fairness_score": "N/A",
        "total_audits": current_data["audit_count"],
        "active_alerts": 0 if current_data["df"] is None else 1,
        "dataset_size": f"{len(current_data['df'])} rows" if current_data["df"] is not None else "0",
        "recent_activities": activities
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    content = await file.read()
    try:
        df, summary = validate_and_load_csv(content)
        current_data["df"] = df
        current_data["filename"] = file.filename
        update_memory(f"Dataset uploaded: {file.filename}")
        return {"summary": summary, "filename": file.filename}
    except Exception as e:
        update_memory(f"Upload error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/columns")
async def get_columns():
    if current_data["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return {"columns": list(current_data["df"].columns)}

@app.post("/detect-bias")
async def detect_bias(sensitive_column: str):
    if current_data["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    
    bias_results = detect_distribution_bias(current_data["df"], sensitive_column)
    current_data["audit_count"] += 1
    update_memory(f"Bias detected in {sensitive_column} column")
    return bias_results

@app.post("/detect-bias-intersectional")
async def detect_bias_intersectional(sensitive_columns: list[str]):
    if current_data["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    
    bias_info = detect_intersectional_bias(current_data["df"], sensitive_columns)
    current_data["audit_count"] += 1
    update_memory(f"Intersectional bias analyzed: {', '.join(sensitive_columns)}")
    return bias_info

@app.get("/audit")
async def audit_dataset():
    if current_data["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    
    df = current_data["df"]
    
    # 1. Check for PII (Simple heuristic)
    pii_keywords = ['name', 'email', 'phone', 'address', 'ssn', 'password', 'credit_card']
    pii_found = [col for col in df.columns if any(key in col.lower() for key in pii_keywords)]
    
    # 2. Check for missing values
    missing = df.isnull().sum().to_dict()
    
    return {
        "pii_detected": pii_found,
        "missing_values": missing,
        "recommendation": "Remove PII columns before training" if pii_found else "Dataset seems safe for basic audit"
    }

@app.post("/train")
async def train(target: str, sensitive_column: str, model_type: str = "logistic_regression"):
    if current_data["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    
    current_data["target"] = target
    
    try:
        model, accuracy, X_train, X_test, y_train, y_test, feature_importance = train_model(
            current_data["df"], target, model_type
        )
        
        y_pred = model.predict(X_test)
        
        # We need the sensitive features for the test set
        # Since we preprocessed, we need to map back or handle indexing
        # For simplicity in MVP, we'll slice the original df
        sensitive_features = current_data["df"].loc[X_test.index, sensitive_column]
        fairness_metrics = evaluate_fairness(y_test, y_pred, sensitive_features)
        
        current_data["audit_count"] += 1
        update_memory(f"Model trained: {model_type}, Accuracy: {accuracy:.4f}")
        
        return {
            "accuracy": accuracy,
            "fairness_metrics": fairness_metrics,
            "feature_importance": feature_importance
        }
    except Exception as e:
        update_memory(f"Training error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/mitigate")
async def mitigate(method: str, sensitive_column: str):
    if current_data["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    
    if method == "oversampling":
        current_data["df"] = apply_oversampling(current_data["df"], sensitive_column)
    elif method == "feature_removal":
        current_data["df"] = apply_feature_removal(current_data["df"], [sensitive_column])
    else:
        raise HTTPException(status_code=400, detail="Unknown mitigation method")
        
    update_memory(f"Mitigation applied: {method} on {sensitive_column}")
    return {"status": "success", "new_size": len(current_data["df"])}

@app.get("/memory")
async def get_memory():
    memory_path = os.path.join(os.path.dirname(__file__), "memory", "memory.md")
    if not os.path.exists(memory_path):
        return {"content": "No logs found."}
    with open(memory_path, "r") as f:
        return {"content": f.read()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
