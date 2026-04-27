import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

from backend.main import current_data

if current_data["df"] is not None:
    print(f"Dataset active. Size: {len(current_data['df'])}")
    print(f"Columns: {current_data['df'].columns.tolist()}")
    if "CustodyStatus" in current_data["df"].columns:
        print(f"CustodyStatus unique count: {current_data['df']['CustodyStatus'].nunique()}")
        print(f"CustodyStatus value counts:\n{current_data['df']['CustodyStatus'].value_counts().head(10)}")
    else:
        print("CustodyStatus NOT FOUND in columns")
else:
    print("NO DATASET LOADED IN BACKEND")
