import axios from "axios";

// Create an Axios instance
const interceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
interceptor.interceptors.request.use(
  (config) => {
    console.log(config.url, process.env.NEXT_PUBLIC_API_BASE_URL);

    // Do not attach token for login route
    if (config.url.includes("/login")) return config;

    // Retrieve the token from localStorage
    const token = localStorage.getItem("masjid_access_jwt_token");

    // If the token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      location.href = "/login";
      return Promise.reject("No token found");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
interceptor.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("masjid_access_jwt_token");
      location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default interceptor;
