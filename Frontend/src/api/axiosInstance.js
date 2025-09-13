import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL, // Base URL for your backend API
  withCredentials: true, // Send cookies with cross-origin requests
});

export const setupAxiosInterceptors = (navigate) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Unauthorized, navigate to login page
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;