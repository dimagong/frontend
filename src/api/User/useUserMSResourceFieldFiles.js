import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const UserMSResourceFieldFilesQueryKey = "user-master-schema-resource-field-files";

export const useUserResourceFieldFiles = ({ rmFieldId, userId }, options = {}) => {
  return useQuery({
    queryKey: [UserMSResourceFieldFilesQueryKey, rmFieldId, userId],
    queryFn: ({ signal }) =>
      clientAPI.get(`/api/user-resource/fields/${rmFieldId}/files`, { signal, params: { user_id: userId } }),
    enabled: !!(rmFieldId && userId),
    ...options,
  });
};
