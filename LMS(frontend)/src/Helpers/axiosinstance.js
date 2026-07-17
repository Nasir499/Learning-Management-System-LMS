import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
axiosInstance.defaults.baseURL = BASE_URL
axiosInstance.defaults.timeout = 600000;
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

axiosInstance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
}, (error) => Promise.reject(error));

export default axiosInstance;