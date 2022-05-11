import { useQuery } from "react-query";

import { clientAPI } from "./clientAPI";

export const useGenericQuery = ({ url, method = "get", queryKey, ...config }, options = {}) => {
  return useQuery({
    queryKey,

    queryFn: ({ signal, ...args }) => clientAPI[method](url, { signal, ...config }),

    ...options,
  });
};
