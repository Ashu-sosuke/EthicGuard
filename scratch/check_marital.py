import sys
import os
import pandas as pd

# Add the project root to sys.path
sys.path.append(os.getcwd())

from backend.main import current_data, CACHE_FILE

# Try to load from cache if in-memory is empty
if current_data["df"] is None and os.path.exists(CACHE_FILE):
    current_data["df"] = pd.read_csv(CACHE_FILE)

if current_data["df"] is not None:
    print(f"Dataset active. Size: {len(current_data['df'])}")
    col = "MaritalStatus"
    if col in current_data["df"].columns:
        print(f"{col} unique count: {current_data['df'][col].nunique()}")
        print(f"{col} value counts:\n{current_data['df'][col].value_counts(dropna=False)}")
    else:
        print(f"{col} NOT FOUND in columns. Available columns: {current_data['df'].columns.tolist()[:10]}")
else:
    print("NO DATASET LOADED IN BACKEND OR CACHE")
