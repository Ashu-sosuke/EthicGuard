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
    """Evaluates fairness metrics using Fairlearn."""
    
    metrics = {
        'accuracy': accuracy_score,
        'selection_rate': selection_rate,
        'false_positive_rate': false_positive_rate
    }
    
    mf = MetricFrame(
        metrics=metrics,
        y_true=y_true,
        y_pred=y_pred,
        sensitive_features=sensitive_features
    )
    
    dp_diff = demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive_features)
    eo_diff = equalized_odds_difference(y_true, y_pred, sensitive_features=sensitive_features)
    
    return {
        "overall": mf.overall.to_dict(),
        "by_group": mf.by_group.to_dict(),
        "demographic_parity_difference": dp_diff,
        "equalized_odds_difference": eo_diff
    }
