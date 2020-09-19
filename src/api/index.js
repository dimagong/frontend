import axios from "axios";
import authService from "services/auth"
import store from "app/store"
import {logout} from 'app/slices/appSlice'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});


instance.interceptors.request.use(
  config => {
      const token = authService.getToken();
      if(token) config.headers.Authorization = `Bearer ${token}`;
      return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  config => {
      return config;
  },
  error => {
    if ('error' in error.response.data &&
    error.response.data.error.message === 'Unauthenticated.' &&
    error.response.data.error.status === 401 &&
    error.config.url.indexOf('login') === -1) {
      store.dispatch(logout())
  }

    Promise.reject(error)
  }
);

export default instance;