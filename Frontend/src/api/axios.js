import axios from "axios";

const baseURL = `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true, // send/receive auth cookies for protected routes
});
// Client side API wrapper with JWT handling and error interception
// Attach JWT from sessionStorage if present (tab-isolated)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Server response interceptor to handle 401 Unauthorized globally
// On 401, clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    const isLoginPage = window.location.pathname === "/login" || window.location.pathname === "/sign-up";
    const isLoadUserRequest = error.config.url.includes("/v2/user/getuser");

    if (status === 401 && !isLoginPage && !isLoadUserRequest) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
