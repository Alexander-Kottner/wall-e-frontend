import axios from 'axios';
import { showError } from '../utils/errors';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Unexpected error';
    showError(message);
    return Promise.reject(error);
  }
);

export default api;
