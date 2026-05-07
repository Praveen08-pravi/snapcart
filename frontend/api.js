import axios from "axios";
import { isTokenExpired } from "./src/utils/auth";

// Ensure we have a valid base URL
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_BACKEND_URI;
  console.log("Environment URL:", envURL);
  
  if (envURL && envURL.trim() !== '' && envURL.startsWith('http')) {
    console.log("Using environment URL:", envURL);
    return envURL;
  }
  
  const defaultURL = "http://localhost:3000/api";
  console.log("Using default URL:", defaultURL);
  return defaultURL;
};

const API = axios.create({
  baseURL: getBaseURL(),
});
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        // Token is expired, handle accordingly (e.g., refresh token or redirect to login)
        localStorage.removeItem("token");
        // Optionally, you can redirect the user to the login page
        window.location.href = "/signin";
        return Promise.reject("Token expired");
      } else {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
