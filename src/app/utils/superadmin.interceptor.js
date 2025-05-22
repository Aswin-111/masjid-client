import axios from "axios";

// Create an Axios instance
const interceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Replace with your API's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

interceptor.interceptors.request.use(
  (config) => {
    if (config.url.includes("/login")) return config;
    // Add the token to the request headers
    const token = localStorage.getItem("masjid_access_jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interceptor.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response.status === 401) {
      // Remove the token from localStorage
      localStorage.removeItem("masjid_access_jwt_token");
      // Redirect to the login page
      return (location.href = "/login");
    }
    return Promise.reject(error);
  }
);

export default interceptor;
