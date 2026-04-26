import pandas as pd
import io
from typing import Tuple, Dict, Any

def validate_and_load_csv(file_content: bytes) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Validates the CSV content and returns a DataFrame and its summary."""
    try:
        df = pd.read_csv(io.BytesIO(file_content))
        summary = {
            "rows": len(df),
            "columns": list(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "dtypes": df.dtypes.apply(lambda x: str(x)).to_dict(),
            "preview": df.head(5).to_dict(orient="records"),
            "stats": df.describe().to_dict() if not df.empty else {}
        }
        return df, summary
    except Exception as e:
        raise ValueError(f"Invalid CSV file: {str(e)}")
