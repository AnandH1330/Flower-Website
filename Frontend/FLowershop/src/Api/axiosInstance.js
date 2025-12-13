
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

// Auto refresh token
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) return Promise.reject(err);

      try {
        const res = await axios.post(`${API_BASE_URL}token/refresh/`, {
          refresh,
        });

        localStorage.setItem("access", res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return API(original);
      } catch {
        localStorage.clear();
        window.location.href = "/signin";
      }
    }

    return Promise.reject(err);
  }
);

export default API;
