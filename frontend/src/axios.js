import axios from "axios";
import { toast } from "react-toastify"; // Opsional: untuk notifikasi
import TokenService from "./utils/token";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"; // Bisa pakai proxy atau direct URL
const API_BASE_URL ="/api"; // Bisa pakai proxy atau direct URL
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor sebelum request dikirim
axiosClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk menangani response dan error
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401) {
      TokenService.clearAuth();
      toast.warning("Session expired. Please log in again.");
      window.location.href = "/login"; // Pakai window.location agar tidak ada masalah dengan router
    } else if (status === 403) {
      toast.error("You do not have permission to access this resource.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      // console.error("API Error:", data?.message || error.message);
      toast.error(data?.message || "An error occurred. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
