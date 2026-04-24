import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Queue to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints (login, register, refresh)
    const isAuthRequest = originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    // Try refresh token on 401 (but not for auth requests)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          if (data.success) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            processQueue(null, data.accessToken);
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Refresh failed — only redirect if NOT on an exam page
          // Exam pages handle auth errors gracefully to avoid losing progress
        } finally {
          isRefreshing = false;
        }
      }

      // Don't force-redirect during an active exam — let the page handle the error
      const isExamPage = window.location.pathname.startsWith("/exam/");
      if (!isExamPage) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
