import _ from "lodash/fp";
import Axios from "axios";

import api from "./index";

const defaultConfig = { onlyData: true, flatData: true, flatError: true };

const privateClientAPI = (method, url, config) => {
  const { signal, onlyData, flatData, flatError, ...axiosConfig } = _.merge(defaultConfig, config);

  let source;

  if (signal) {
    source = Axios.CancelToken.source();

    signal.addEventListener("abort", () => source.cancel("Query was cancelled by React Query"));
  }

  const promise = api.request(url, {
    method,
    cancelToken: source?.token,
    ...axiosConfig,
  });

  return promise.then(
    (response) => {
      if (onlyData) {
        return response.data.data;
      }

      if (flatData) {
        return { ...response, data: response.data.data };
      }

      return response;
    },
    (error) => Promise.reject(flatError ? error.response.data.error : error)
  );
};

export const clientAPI = {
  get: (url, config) => privateClientAPI("GET", url, config),
  post: (url, data, config) => privateClientAPI("POST", url, { data, ...config }),
  put: (url, data, config) => privateClientAPI("PUT", url, { data, ...config }),
  patch: (url, data, config) => privateClientAPI("PATCH", url, { data, ...config }),
  delete: (url, data, config) => privateClientAPI("DELETE", url, { data, ...config }),
};
