import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const MSUserFieldsQueryKey = "master-schema-user-fields";

export const useMSFields = ({ userId }, options = {}) => {
  return useQuery({
    queryKey: [MSUserFieldsQueryKey, { userId: !!userId }],
    queryFn: ({ signal }) =>
      clientAPI.get(`/api/master-schema-field`, {
        signal,
        params: {
          ...(userId ? { user_id: userId } : {}),
        },
      }),
    ...options,
  });
};
