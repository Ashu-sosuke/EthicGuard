import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from typing import Dict, Any, Tuple

def preprocess_data(df: pd.DataFrame, target: str):
    """Simple preprocessing for ML models."""
    le = LabelEncoder()
    df_encoded = df.copy()
    
    # Auto-bin target if it's numeric and has many values (to allow fairness metrics to work)
    if df_encoded[target].dtype != 'object' and df_encoded[target].nunique() > 10:
        median_val = df_encoded[target].median()
        df_encoded[target] = (df_encoded[target] > median_val).astype(int)
    
    for col in df_encoded.columns:
        if df_encoded[col].dtype == 'object':
            df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
            
    X = df_encoded.drop(columns=[target])
    y = df_encoded[target]
    
    return X, y

def train_model(df: pd.DataFrame, target: str, model_type: str = "logistic_regression") -> Tuple[Any, float, Any, Any, Any, Any]:
    """Trains a model and returns the model and its accuracy."""
    X, y = preprocess_data(df, target)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    if model_type == "logistic_regression":
        model = LogisticRegression(max_iter=1000)
    else:
        model = DecisionTreeClassifier()
        
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Feature Importance (XAI)
    if model_type == "logistic_regression":
        import numpy as np
        importance = np.abs(model.coef_[0])
    else:
        importance = model.feature_importances_
        
    feature_importance = dict(zip(X.columns, [round(float(x), 4) for x in importance]))
    
    return model, accuracy, X_train, X_test, y_train, y_test, feature_importance
