import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from typing import Dict, Any, Tuple

def preprocess_data(df: pd.DataFrame, target: str):
    """Simple preprocessing for ML models with scaling and ID removal."""
    le = LabelEncoder()
    df_encoded = df.copy()
    
    # Drop rows with missing values
    df_encoded = df_encoded.dropna()
    
    # 1. Automatically drop ID-like columns (high cardinality + 'id' in name)
    cols_to_drop = []
    for col in df_encoded.columns:
        if col == target: continue
        is_id_name = any(id_key in col.lower() for id_key in ['id', 'uuid', 'pk', 'index', 'case_id', 'assessmentid'])
        if is_id_name and df_encoded[col].nunique() > len(df_encoded) * 0.5:
            cols_to_drop.append(col)
    
    df_encoded = df_encoded.drop(columns=cols_to_drop)
    
    # 2. Handle Target Cardinality
    # If target has too many classes and is not numeric, we can't really train a classifier
    if df_encoded[target].dtype == 'object' or df_encoded[target].dtype == 'category':
        if df_encoded[target].nunique() > 20:
            # Force it to top 2 categories or binary
            top_2 = df_encoded[target].value_counts().index[:2]
            df_encoded = df_encoded[df_encoded[target].isin(top_2)]
            print(f"Target {target} had high cardinality. Filtered to top 2 classes.")
            
    # Auto-bin target if it's numeric and has many values
    elif df_encoded[target].nunique() > 10:
        median_val = df_encoded[target].median()
        df_encoded[target] = (df_encoded[target] > median_val).astype(int)
    
    # Encode categorical features
    for col in df_encoded.columns:
        if df_encoded[col].dtype == 'object' or str(df_encoded[col].dtype) == 'category':
            df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
            
    X = df_encoded.drop(columns=[target])
    y = df_encoded[target]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns, index=X.index)
    
    return X_scaled, y

def train_model(df: pd.DataFrame, target: str, model_type: str = "logistic_regression") -> Tuple[Any, float, Any, Any, Any, Any]:
    """Trains a model and returns the model and its accuracy."""
    X, y = preprocess_data(df, target)
    
    if len(X) < 10:
        raise ValueError("Not enough data points after preprocessing to train a model.")
        
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    if model_type == "logistic_regression":
        # Multi-class is handled automatically by the default multinomial solver in newer sklearn
        model = LogisticRegression(max_iter=2000, solver='lbfgs')
    else:
        model = DecisionTreeClassifier()
        
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Feature Importance (XAI)
    if model_type == "logistic_regression":
        import numpy as np
        # For multi-class, we take the mean absolute coefficient across classes
        if len(model.classes_) > 2:
            importance = np.mean(np.abs(model.coef_), axis=0)
        else:
            importance = np.abs(model.coef_[0])
    else:
        importance = model.feature_importances_
        
    feature_importance = dict(zip(X.columns, [round(float(x), 4) for x in importance]))
    
    return model, accuracy, X_train, X_test, y_train, y_test, feature_importance
