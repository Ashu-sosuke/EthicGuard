import pandas as pd
import io
import math
from typing import Tuple, Dict, Any

def sanitize_for_json(obj: Any) -> Any:
    """Recursively replaces NaN, Inf, and -Inf with None for JSON serialization."""
    if isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_for_json(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
    return obj

def validate_and_load_csv(file_content: bytes) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Validates the CSV content and returns a DataFrame and its summary."""
    encodings = ['utf-8', 'latin-1', 'cp1252', 'ISO-8859-1']
    df = None
    last_error = None

    for encoding in encodings:
        try:
            df = pd.read_csv(io.BytesIO(file_content), encoding=encoding)
            break
        except Exception as e:
            last_error = e
            continue

    if df is None:
        raise ValueError(f"Invalid CSV file: {str(last_error)}")

    try:
        summary = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "column_names": list(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "dtypes": df.dtypes.apply(lambda x: str(x)).to_dict(),
            "preview": df.head(5).to_dict(orient="records"),
            "stats": df.describe().to_dict() if not df.empty else {}
        }
        
        # Deeply sanitize the summary dictionary for JSON
        safe_summary = sanitize_for_json(summary)
        
        return df, safe_summary
    except Exception as e:
        raise ValueError(f"Error summarizing dataset: {str(e)}")
