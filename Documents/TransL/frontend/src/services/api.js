import axios from "axios";

const API = axios.create({
  baseURL: "https://transport-logistics-8655.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// handle session expiry globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export const signupUser = async (name, email, password) => {
  const res = await API.post("/api/auth/signup", { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post("/api/auth/login-json", { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};

export default API;