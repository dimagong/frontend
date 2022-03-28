import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const RMFieldFileReferenceUsersQueryKey = "resource-manager-field-file-reference-users";

export const useRMFieldFileReferenceUsers = ({ fileId }, options = {}) => {
  return useQuery({
    queryKey: [RMFieldFileReferenceUsersQueryKey, fileId],
    queryFn: ({ signal }) => clientAPI.get(`/api/resource-manager-field-file/${fileId}/references/users`, { signal }),
    enabled: !!fileId,
    ...options,
  });
};
