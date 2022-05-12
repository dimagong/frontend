import { useMutation, useQueryClient } from "react-query";

import { clientAPI } from "./clientAPI";

export const useOptimisticMutation = (mutualConfig, options = {}) => {
  const { url, method, queryKey, updater, invalidateOptions, ...clientAPIConfig } = mutualConfig;

  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: (data) => clientAPI[method](url, data, clientAPIConfig),

    onMutate: async (newData) => {
      if (options.onMutate) {
        options.onMutate(newData);
      }

      await queryClient.cancelQueries(queryKey);

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, updater);

      return { previousData };
    },

    onError: (error, newData, context) => {
      if (options.onError) {
        options.onError(error, newData, context);
      }

      queryClient.setQueryData(queryKey, context.previousData);
    },

    onSettled: (...args) => {
      if (options.onSettled) {
        options.onSettled(...args);
      }

      return queryClient.invalidateQueries(queryKey, invalidateOptions);
    },
  });
};
