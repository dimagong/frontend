import { useMutation, useQueryClient } from "react-query";

export const useGenericMutation = ({ mutationFn, queryKey, ...options }) => {
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

export const useOptimisticMutation = ({ mutationFn, queryKey, updater, ...options }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onMutate: async (data) => {
      await queryClient.cancelQueries(queryKey);

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        return updater ? updater(oldData, data) : data;
      });

      return previousData;
    },

    onError: (error, _, context) => queryClient.setQueryData(queryKey, context),

    onSettled: () => queryClient.invalidateQueries(queryKey),

    ...options,
  });
};
