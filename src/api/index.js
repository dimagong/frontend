import _ from "lodash/fp";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";

import authService from "services/auth";

import store from "app/store";
import appSlice from "app/slices/appSlice";
import { GoogleDriveAuthRequestToast } from "components/Toasts/GoogleDriveAuthRequestToast";

const { logout } = appSlice.actions;

const INTERNAL_CODE_UNAUTHENTICATED = 101;
const INTERNAL_CODE_GOOGLE_AUTH_REQUEST = 201;

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
    error.response.data?.error?.internal_code === INTERNAL_CODE_UNAUTHENTICATED &&
    error.config.url.indexOf("login") === -1 &&
    error.config.url.indexOf("logout") === -1
  ) {
    if (authService.isLoggedIn()) {
      store.dispatch(logout());
      authService.logout();
    } else {
      authService.logout();
    }
    // ToDo: refactor it
  } else if (error.response.data instanceof Blob) {
    // When response type is Blob.

    error.response.data.text().then((text) => {
      const data = JSON.parse(text);

      if (data?.error?.internal_code === INTERNAL_CODE_GOOGLE_AUTH_REQUEST) {
        toast(<GoogleDriveAuthRequestToast link={data?.error?.message} />, {
          draggable: true,
          closeOnClick: false,
          autoClose: false,
          toastId: "GoogleDriveAuthRequestToast",
        });
      }

      if (data?.error?.message) {
        toast.error(data.error.message);
      }
    });

    // ToDo: refactor it
  } else if (error.response.data?.error?.internal_code === INTERNAL_CODE_GOOGLE_AUTH_REQUEST) {
    toast(<GoogleDriveAuthRequestToast link={error.response.data.error.message} />, {
      draggable: true,
      closeOnClick: false,
      autoClose: false,
      toastId: "GoogleDriveAuthRequestToast",
    });
  } else if (error.response.data?.error?.message) {
    toast.error(error.response.data.error.message);
  }

  return Promise.reject(error);
};

const instance = axios.create({
  //baseURL: process.env.REACT_APP_API_URL,
  baseURL: process.env.REACT_APP_API_TEST_PROSPECT,
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
