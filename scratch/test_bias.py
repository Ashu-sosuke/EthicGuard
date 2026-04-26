import pandas as pd
from backend.bias.data_bias import detect_distribution_bias, detect_intersectional_bias

# Create dummy data
df = pd.DataFrame({
    'gender': ['M', 'M', 'F', 'M', 'F'],
    'income': ['high', 'low', 'low', 'high', 'low'],
    'age': [25, 30, 35, 40, 45]
})

print("Testing detect_distribution_bias...")
try:
    res = detect_distribution_bias(df, 'gender')
    print("Result:", res)
except Exception as e:
    print("Error:", e)

print("\nTesting detect_intersectional_bias...")
try:
    res = detect_intersectional_bias(df, ['gender', 'income'])
    print("Result:", res)
except Exception as e:
    print("Error:", e)
