import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = async (name, email, password) => {
  const res = await API.post("/api/auth/signup", {
    name: name,
    email: email,
    password: password,
  });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post("/api/auth/login-json", {
    email: email,
    password: password,
  });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};

export default API;