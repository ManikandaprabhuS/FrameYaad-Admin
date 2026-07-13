import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fy_auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }

    return Promise.reject(error);
  }
);

export default api;
