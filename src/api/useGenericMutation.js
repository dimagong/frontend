import { useMutation, useQueryClient } from "react-query";

import { clientAPI } from "./clientAPI";

export const useGenericMutationDeprecated = ({ mutationFn, queryKey, ...options }) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...(options ?? {}),
    mutationFn,

    onSettled: (...args) => {
      options.onSettled && options.onSettled(...args);
      queryKey && queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useGenericMutation = (mutualConfig, options = {}) => {
  const {
    url,
    method,
    queryKey,
    invalidateOptions,
    transformData,
    shouldRemoveQuery = false,
    ...clientAPIConfig
  } = mutualConfig;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => clientAPI[method](url, transformData ? transformData(data) : data, clientAPIConfig),

    onSettled: queryKey
      ? (...args) => {
          let exactQueryKey = queryKey;

          if (typeof queryKey === "function") {
            exactQueryKey = queryKey(...args);
          }

          if (Array.isArray(queryKey)) {
            exactQueryKey = queryKey;
          } else {
            exactQueryKey = [queryKey];
          }

          const promises = exactQueryKey.map((queryKey) => {
            if (shouldRemoveQuery) {
              queryClient.removeQueries(queryKey);
              return Promise.resolve();
            }

            return queryClient.invalidateQueries(queryKey, invalidateOptions);
          });

          return Promise.all(promises);
        }
      : undefined,

    ...options,
  });
};
