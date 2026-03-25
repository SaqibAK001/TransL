import axios from 'axios';

const API_URL = "http://localhost:8000/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (creds) => api.post("/auth/token", new URLSearchParams(creds));
export const getMatches = () => api.get("/matching/optimize");
export const postCargo = (data) => api.post("/cargo/", data);