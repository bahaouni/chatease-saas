import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // Use env var, fallback to localhost for dev
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) or 422 (Unprocessable/Invalid Token Signature)
    if (error.response && (error.response.status === 401 || error.response.status === 422) && !originalRequest._retry) {
      // If it's a 422, it's likely a bad signature (secret changed), so just logout immediately
      // BUT only if not already on login page to avoid loops
      if (error.response.status === 422) {
         const msg = error.response.data?.msg || "";
         const isTokenError = msg.includes("Signature") || msg.includes("token") || msg.includes("Invalid") || msg.includes("expired");
         
         if (isTokenError && typeof window !== 'undefined' && window.location.pathname !== '/login') {
            console.warn("Invalid Token (422), logging out:", msg);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(error);
         }
         // If 422 but not a token error (e.g. validation), just reject (don't logout)
         if (!isTokenError) {
             return Promise.reject(error);
         }
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          if (res.status === 200) {
            const { access_token } = res.data;
            localStorage.setItem('token', access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token Refresh Failed:", refreshError);
        // Fall through to logout
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
