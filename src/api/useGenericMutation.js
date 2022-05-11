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
  const { url, method, queryKey, invalidateOptions, ...clientAPIConfig } = mutualConfig;

  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: (data) => clientAPI[method](url, data, clientAPIConfig),

    onSettled: (...args) => {
      if (options.onSettled) {
        options.onSettled(...args);
      }

      return queryClient.invalidateQueries(queryKey, invalidateOptions);
    },
  });
};
