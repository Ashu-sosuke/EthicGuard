import pandas as pd
from typing import Dict, Any

def detect_distribution_bias(df: pd.DataFrame, sensitive_column: str) -> Dict[str, Any]:
    """Detects distribution imbalance in a sensitive column."""
    counts = df[sensitive_column].value_counts(normalize=True).to_dict()
    
    # Calculate max disparity
    max_val = max(counts.values())
    min_val = min(counts.values())
    disparity = max_val - min_val
    
    bias_flag = disparity > 0.1  # Flag if disparity is more than 10%
    
    return {
        "column": sensitive_column,
        "distribution": {str(k): float(v) for k, v in counts.to_dict().items()},
        "disparity": float(round(disparity, 4)),
        "bias_flag": bool(bias_flag),
        "severity": "High" if disparity > 0.3 else "Medium" if disparity > 0.1 else "Low"
    }

def detect_intersectional_bias(df: pd.DataFrame, sensitive_columns: list) -> Dict[str, Any]:
    """Detects bias across combinations of sensitive columns."""
    if not sensitive_columns or len(sensitive_columns) < 2:
        return {"error": "At least two columns required for intersectional analysis."}
        
    counts = df.groupby(sensitive_columns).size() / len(df)
    counts_dict = {str(k): v for k, v in counts.to_dict().items()}
    
    max_val = max(counts.values)
    min_val = min(counts.values)
    disparity = max_val - min_val
    
    return {
        "columns": sensitive_columns,
        "distribution": {str(k): float(v) for k, v in counts.to_dict().items()},
        "disparity": float(round(disparity, 4)),
        "bias_flag": bool(disparity > 0.2),
        "severity": "High" if disparity > 0.4 else "Medium" if disparity > 0.2 else "Low"
    }

def detect_categorical_bias(df: pd.DataFrame, target_column: str, sensitive_column: str) -> Dict[str, Any]:
    """Detects if a categorical target is biased towards a sensitive group."""
    # Group by sensitive column and calculate mean of target (if target is binary)
    # If target is categorical, calculate proportions of positive outcome
    
    pivot = pd.crosstab(df[sensitive_column], df[target_column], normalize='index')
    
    return {
        "pivot_table": pivot.to_dict()
    }
