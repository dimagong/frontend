import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";
import { useGenericMutation } from "../useGenericMutation";

export const UserRMFieldFilesQueryKey = "user-resource-manager-field-files";

export const useUserRMFieldFiles = ({ rmFieldId, userId }, options = {}) => {
  return useQuery({
    queryKey: [UserRMFieldFilesQueryKey, rmFieldId, userId],
    queryFn: ({ signal }) =>
      clientAPI.get(`/api/user-resource/fields/${rmFieldId}/files`, { signal, params: { user_id: userId } }),
    enabled: !!(rmFieldId && userId),
    ...options,
  });
};

// That mutations are duplicating the same from api/resourceManager/useRMFieldFiles
// While API did not implement ResourceManager Files entity as one resource
// That mutation should have its own QueryKey to separate them from ResourceMangers files scope

export const useDeleteUserRMFile = ({ fileId, fieldId, userId }, options = {}) => {
  return useGenericMutation({
    queryKey: [UserRMFieldFilesQueryKey, fieldId, userId],
    mutationFn: () => clientAPI.delete(`api/resource-manager-field-file/${fileId}`),
    ...options,
  });
};

export const useFinishUserRMFile = ({ fileId, fieldId, userId }, options = {}) => {
  return useGenericMutation({
    queryKey: [UserRMFieldFilesQueryKey, fieldId, userId],
    mutationFn: () => clientAPI.post(`api/resource-manager-field-file/${fileId}/finish-editing`),
    ...options,
  });
};
