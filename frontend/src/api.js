import axios from "axios";

// Use backend URL from environment variable
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Attach token automatically for all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("emp_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
