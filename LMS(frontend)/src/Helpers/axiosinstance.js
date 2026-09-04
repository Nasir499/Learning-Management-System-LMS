import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "https://learning-management-system-lms-2-cd4y.onrender.com";
const cleanUrl = rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
const BASE_URL = `${cleanUrl}/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.timeout = 600000;
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
}, (error) => Promise.reject(error));

export default axiosInstance;