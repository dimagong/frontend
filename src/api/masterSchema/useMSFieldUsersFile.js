import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const MSFieldUsersFileQueryKey = "master-schema-field-users-file";

export const useMSFieldUsersFile = ({ msFieldId, userId, resourceManagerFieldFileId }, options) => {
  return useQuery({
    queryKey: [MSFieldUsersFileQueryKey, { msFieldId, userId }],
    queryFn: ({ signal }) =>
      clientAPI.get(`api/master-schema-field/${msFieldId}/users/${userId}/file`, {
        params: {
          resource_manager_field_file_id: resourceManagerFieldFileId
        },
        responseType: "blob",
        onlyData: false,
        flatData: false,
        flatError: false,
        signal,
      }),
    enabled: [msFieldId, userId].every(Boolean),
    ...options,
  });
};
