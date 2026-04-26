import pandas as pd
from sklearn.model_selection import train_test_split
from fairlearn.metrics import MetricFrame, demographic_parity_difference
from sklearn.metrics import accuracy_score

# Mock data similar to oversampled state
df = pd.DataFrame({
    'gender': ['male']*16 + ['female']*16,
    'income': [1]*32
})

X = df.drop(columns=['income'])
y = df['income']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
y_pred = [1] * len(y_test)
sensitive_features = df.loc[X_test.index, 'gender']

print(f"y_test len: {len(y_test)}")
print(f"y_pred len: {len(y_pred)}")
print(f"sensitive_features len: {len(sensitive_features)}")

mf = MetricFrame(
    metrics={'acc': accuracy_score},
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_features
)
print("MetricFrame OK")

dp = demographic_parity_difference(y_test, y_pred, sensitive_features=sensitive_features)
print("DP OK")
