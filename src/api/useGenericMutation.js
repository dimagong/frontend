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
  const { url, method, queryKey, invalidateOptions, transformData, ...clientAPIConfig } = mutualConfig;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => clientAPI[method](url, transformData ? transformData(data) : data, clientAPIConfig),

    onSettled: () => {
      return queryClient.invalidateQueries(queryKey, invalidateOptions);
    },

    ...options,
  });
};
