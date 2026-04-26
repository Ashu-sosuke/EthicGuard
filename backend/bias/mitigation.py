import pandas as pd
from sklearn.utils import resample
from typing import Tuple

def apply_oversampling(df: pd.DataFrame, sensitive_column: str) -> pd.DataFrame:
    """Applies oversampling to balance sensitive groups."""
    counts = df[sensitive_column].value_counts()
    max_count = counts.max()
    
    resampled_dfs = []
    for group in counts.index:
        group_df = df[df[sensitive_column] == group]
        if len(group_df) < max_count:
            group_df = resample(group_df, replace=True, n_samples=max_count, random_state=42)
        resampled_dfs.append(group_df)
        
    return pd.concat(resampled_dfs, ignore_index=True)

def apply_feature_removal(df: pd.DataFrame, columns_to_remove: list) -> pd.DataFrame:
    """Removes sensitive features from the dataset."""
    return df.drop(columns=columns_to_remove)

def apply_reweighting(df: pd.DataFrame, sensitive_column: str, target_column: str) -> pd.Series:
    """
    Calculates weights for each sample to mitigate bias.
    Weight = P(Y)P(S) / P(Y,S)
    """
    # Simple reweighting implementation
    n = len(df)
    weights = pd.Series(1.0, index=df.index)
    
    for s_val in df[sensitive_column].unique():
        for y_val in df[target_column].unique():
            p_s = len(df[df[sensitive_column] == s_val]) / n
            p_y = len(df[df[target_column] == y_val]) / n
            p_sy = len(df[(df[sensitive_column] == s_val) & (df[target_column] == y_val)]) / n
            
            if p_sy > 0:
                weight = (p_s * p_y) / p_sy
                weights[(df[sensitive_column] == s_val) & (df[target_column] == y_val)] = weight
                
    return weights

def optimize_thresholds(y_true, y_prob, sensitive_features):
    """
    Post-processing technique to find optimal thresholds for each group
    to satisfy Equalized Odds or Demographic Parity.
    """
    import numpy as np
    from sklearn.metrics import roc_curve
    
    unique_groups = np.unique(sensitive_features)
    group_thresholds = {}
    
    for group in unique_groups:
        mask = (sensitive_features == group)
        fpr, tpr, thresholds = roc_curve(y_true[mask], y_prob[mask])
        
        # Simple heuristic: find threshold that balances FPR and TPR
        idx = np.argmin(np.abs(fpr - (1 - tpr)))
        group_thresholds[group] = float(thresholds[idx])
        
    return group_thresholds
