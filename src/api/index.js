import axios from "axios";
import authService from "services/auth"
import store from "app/store"
import { toast } from "react-toastify";

import appSlice from 'app/slices/appSlice'

const { logout } = appSlice.actions;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {"Content-Type": "application/json"},
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  config => {

    if (config.config.method !== "get" && config?.data?.success?.message) {
      toast.success(config.data.success.message)
    }

    return config;
  },
  error => {
    if ('error' in error.response.data &&
      error.response.data.error.status === 401 &&
      error.config.url.indexOf('login') === -1 &&
      error.config.url.indexOf('logout') === -1
    ) {
      if(authService.isLoggedIn()) {
        store.dispatch(logout());
        authService.logout();
      } else {
        authService.logout();
      }
    } else if (error.response.data?.error?.message) {
      toast.error(error.response.data.error.message)
    }

    return Promise.reject(error)
  }
);

export default instance;
