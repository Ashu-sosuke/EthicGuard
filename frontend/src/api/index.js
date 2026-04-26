import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadDataset = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getColumns = () => api.get('/columns');

export const detectBias = (sensitiveColumn) => 
  api.post(`/detect-bias?sensitive_column=${sensitiveColumn}`);

export const trainModel = (target, sensitiveColumn, modelType) => 
  api.post(`/train?target=${target}&sensitive_column=${sensitiveColumn}&model_type=${modelType}`);

export const applyMitigation = (method, sensitiveColumn) => 
  api.post(`/mitigate?method=${method}&sensitive_column=${sensitiveColumn}`);

export const getMemoryLogs = () => api.get('/memory');

export default api;
