import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const UserMSResourceFieldsQueryKey = "user-master-schema-resource-fields";

export const useUserMSResourceFields = ({ userId }, options = {}) => {
  return useQuery({
    queryKey: [UserMSResourceFieldsQueryKey, userId],
    queryFn: ({ signal }) => clientAPI.get("/api/user-resource/fields", { signal, params: { user_id: userId } }),
    ...options,
  });
};
