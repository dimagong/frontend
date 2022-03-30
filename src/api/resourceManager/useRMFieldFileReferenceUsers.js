import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const RMFieldFileReferenceUsersQueryKey = "resource-manager-field-file-reference-users";

// export const useRMFieldFileReferenceUsers = ({ fileId }, options = {}) => {
//   return useQuery({
//     queryKey: [RMFieldFileReferenceUsersQueryKey, fileId],
//     queryFn: ({ signal }) => clientAPI.get(`/api/resource-manager-field-file/${fileId}/references/users`, { signal }),
//     enabled: !!fileId,
//     ...options,
//   });
// };

// ToDo: what is this
export const useAccessQueryUsers = (options = {}) => {
  return useQuery({
    queryKey: ["access-query/users"],
    queryFn: ({ signal }) => clientAPI.get(`api/access-query/users`, { signal }),
    ...options,
  });
};
