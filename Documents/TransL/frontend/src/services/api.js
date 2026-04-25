import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- AUTH ----------------
export const signupUser = (data) => API.post("/api/auth/signup", data);
export const loginUser = (data) => API.post("/api/auth/login-json", data);
export const getMe = () => API.get("/api/auth/me");

// ---------------- CARGO ----------------
export const getAllCargo = () => API.get("/api/");
export const addCargo = (data) => API.post("/api/", data);
export const updateCargo = (cargo_id, data) => API.put(`/api/${cargo_id}`, data);
export const deleteCargo = (cargo_id) => API.delete(`/api/${cargo_id}`);

// ---------------- TRUCK ----------------
export const addTruck = (data) => API.post("/api/add", data);
export const deleteTruck = (truck_id) => API.delete(`/api/delete/${truck_id}`);

// ---------------- MATCHING ----------------
export const runMatching = () => API.post("/api/run");

export default API;