import _ from "lodash/fp";
import axios from "axios";
import { toast } from "react-toastify";

import authService from "services/auth";

import store from "app/store";
import appSlice from "app/slices/appSlice";

const { logout } = appSlice.actions;

const requestResolveInterceptor = (config) => {
  const token = authService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};
const requestRejectInterceptor = (error) => Promise.reject(error);

const responseResolveInterceptor = (config) => {
  if (config.config.method !== "get" && config?.data?.success?.message) {
    toast.success(config.data.success.message);
  }

  return config;
};
const responseRejectInterceptor = (error) => {
  if (
    "error" in error.response.data &&
    error.response.data.error.status === 401 &&
    error.config.url.indexOf("login") === -1 &&
    error.config.url.indexOf("logout") === -1
  ) {
    if (authService.isLoggedIn()) {
      store.dispatch(logout());
      authService.logout();
    } else {
      authService.logout();
    }
  } else if (error.response.data?.error?.message) {
    toast.error(error.response.data.error.message);
  }

  return Promise.reject(error);
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(requestResolveInterceptor, requestRejectInterceptor);
instance.interceptors.response.use(responseResolveInterceptor, responseRejectInterceptor);

export const http = {
  request: (...args) => instance.request(...args).then(_.get("data")),
  get: (...args) => instance.get(...args).then(_.get("data")),
  delete: (...args) => instance.delete(...args).then(_.get("data")),
  head: (...args) => instance.head(...args).then(_.get("data")),
  options: (...args) => instance.options(...args).then(_.get("data")),
  post: (...args) => instance.post(...args).then(_.get("data")),
  put: (...args) => instance.put(...args).then(_.get("data")),
  patch: (...args) => instance.patch(...args).then(_.get("data")),
};

export const requestLayout = async (url, method, data) => {
  const getRequestInstancePayload = {
    url,
    method,
    params: data,
  };
  const defaultRequestInstancePayload = {
    url,
    method,
    data,
  };

  try {
    const result = await instance(method === "GET" ? getRequestInstancePayload : defaultRequestInstancePayload);

    return result.data.data || result.data;
  } catch (err) {
    return err.response.data.error;
  }
};

export default instance;
