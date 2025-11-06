import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5000/api", // backend URL
  withCredentials: true, // send cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
