# Unbiased AI Decision System

A full-stack application to detect, analyze, and mitigate bias in machine learning datasets and models.

## Features
- **File Upload**: Support for CSV datasets.
- **Bias Detection**: Analyze distribution imbalance in sensitive columns.
- **Model Training**: Train Logistic Regression or Decision Tree models.
- **Fairness Evaluation**: Real-time fairness metrics (Demographic Parity, Equalized Odds).
- **Bias Mitigation**: Apply Oversampling or Feature Removal.
- **Persistent Logs**: All actions recorded in `memory.md`.

## Tech Stack
- **Backend**: FastAPI, Pandas, Scikit-learn, Fairlearn.
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts.

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js & npm

### Backend Setup
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend:
   ```bash
   python -m backend.main
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open the frontend in your browser (usually `http://localhost:5173`).
2. Upload a dataset (e.g., `adult_census.csv`).
3. Use the Dashboard to detect bias.
4. Train a model and observe fairness metrics.
5. Apply mitigation if needed and re-evaluate.
