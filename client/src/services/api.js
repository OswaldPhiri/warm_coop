import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (!baseURL.endsWith('/api')) {
  baseURL = `${baseURL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL,
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('warmcoop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardStats = () => api.get('/dashboard/stats');

// Batches
export const getBatches = () => api.get('/batches');
export const createBatch = (data) => api.post('/batches', data);
export const updateBatch = (id, data) => api.patch(`/batches/${id}`, data);
export const deleteBatch = (id) => api.delete(`/batches/${id}`);

// Records
export const getRecords = () => api.get('/records');
export const createRecord = (data) => api.post('/records', data);
export const updateRecord = (id, data) => api.patch(`/records/${id}`, data);
export const deleteRecord = (id) => api.delete(`/records/${id}`);

// Vaccinations
export const getVaccinations = () => api.get('/vaccinations');
export const createVaccination = (data) => api.post('/vaccinations', data);
export const updateVaccination = (id, data) => api.patch(`/vaccinations/${id}`, data);
export const deleteVaccination = (id) => api.delete(`/vaccinations/${id}`);

// Transactions
export const getTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.patch(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export default api;
