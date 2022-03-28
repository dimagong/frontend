import { useQuery } from "react-query";
import { clientAPI } from "../clientAPI";

export const MSUserFieldsQueryKey = "master-schema-user-fields";

export const useMSUserFields = ({ userId }, options = {}) => {
  return useQuery({
    queryKey: [MSUserFieldsQueryKey, userId],
    queryFn: ({ signal }) => clientAPI.get(`/api/master-schema-field`, { signal, params: { user_id: userId } }),
    enabled: !!userId,
    ...options,
  });
};
