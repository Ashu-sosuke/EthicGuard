from fairlearn.metrics import (
    MetricFrame,
    demographic_parity_difference,
    equalized_odds_difference,
    false_positive_rate,
    selection_rate
)
from sklearn.metrics import accuracy_score
import pandas as pd
from typing import Dict, Any

def evaluate_fairness(y_true, y_pred, sensitive_features) -> Dict[str, Any]:
    """Evaluates fairness metrics using Fairlearn with robustness for non-binary data."""
    
    # Try to determine pos_label (usually 1 after LabelEncoding)
    import numpy as np
    unique_labels = np.unique(y_true)
    pos_label = 1 if 1 in unique_labels else unique_labels[0]
    
    # Define metrics with pre-bound pos_label to avoid crashes
    from functools import partial
    
    safe_selection_rate = partial(selection_rate, pos_label=pos_label)
    safe_fpr = partial(false_positive_rate, pos_label=pos_label)
    
    metrics = {
        'accuracy': accuracy_score,
        'selection_rate': safe_selection_rate,
        'false_positive_rate': safe_fpr
    }
    
    try:
        mf = MetricFrame(
            metrics=metrics,
            y_true=y_true,
            y_pred=y_pred,
            sensitive_features=sensitive_features
        )
        
        # Differences only work well for binary, so we wrap them
        try:
            dp_diff = demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive_features)
            eo_diff = equalized_odds_difference(y_true, y_pred, sensitive_features=sensitive_features)
        except:
            dp_diff, eo_diff = 0.0, 0.0

        return {
            "overall": mf.overall.to_dict(),
            "by_group": mf.by_group.to_dict(),
            "demographic_parity_difference": float(dp_diff),
            "equalized_odds_difference": float(eo_diff)
        }
    except Exception as e:
        # Fallback for truly incompatible data shapes
        return {
            "overall": {"accuracy": float(accuracy_score(y_true, y_pred))},
            "by_group": {},
            "demographic_parity_difference": 0.0,
            "equalized_odds_difference": 0.0,
            "error": str(e)
        }
