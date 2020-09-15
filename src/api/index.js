import axios from "axios";
import authService from "services/auth"


const instanceFormData = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});


instanceFormData.interceptors.request.use(
  config => {
      const token = authService.getToken();
      if(token) config.headers.Authorization = `Bearer ${token}`;
      return config;
  },
  error => Promise.reject(error)
);

export default instanceFormData;