import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor: Attach JWT token ──
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const { access_token } = JSON.parse(raw);
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    } catch {
      /* ignore parse errors */
    }
  }
  return config;
});

// ── Response Interceptor: Unwrap { success, message, data } + handle auth errors ──
api.interceptors.response.use(
  (response) => {
    // If backend returns standardized format, unwrap so callers get .data directly
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only force-logout if user had an actual auth token (expired/revoked session).
      // Demo sessions without a JWT should not be redirected.
      const hadAuth = localStorage.getItem("auth");
      if (hadAuth) {
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
