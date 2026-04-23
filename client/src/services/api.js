import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getBatches = () => api.get('/batches');
export const createBatch = (data) => api.post('/batches', data);
export const getRecords = () => api.get('/records');
export const createRecord = (data) => api.post('/records', data);
export const getVaccinations = () => api.get('/vaccinations');
export const createVaccination = (data) => api.post('/vaccinations', data);
export const updateVaccination = (id, data) => api.patch(`/vaccinations/${id}`, data);
export const getTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('/transactions', data);

export default api;
