import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

// Attach the access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a 401 comes back, try refreshing the token automatically
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try once (avoid infinite loop)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccess = res.data.access;
          localStorage.setItem('authToken', newAccess);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest);
        } catch (_refreshErr) {
          // Refresh token is also expired — force logout
          localStorage.clear();
          window.location.href = '/';
          return Promise.reject(_refreshErr);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;
