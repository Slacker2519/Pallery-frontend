import axios from "axios";
import { DB_URL } from "../constants/index.js";

const api = axios.create({
  baseURL: DB_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
