import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";
import { useGenericMutationDeprecated } from "../useGenericMutation";

export const UserMSResourcesQueryKey = "user-master-schema-resources";

export const useUserMSResource = ({ msFieldId, userId }, options = {}) => {
  return useQuery({
    queryKey: [UserMSResourcesQueryKey, msFieldId, userId],
    queryFn: ({ signal }) =>
      clientAPI.get("/api/user-resource", { signal, params: { master_schema_field_id: msFieldId, user_id: userId } }),
    ...options,
  });
};

export const useAttachResourceFileToMS = ({ msFieldId, userId }, options = {}) => {
  return useGenericMutationDeprecated({
    mutationFn: ({ rmFieldFileId }) =>
      clientAPI
        .put("api/user-resource", {
          user_id: userId,
          master_schema_field_id: msFieldId,
          resource_manager_field_file_id: rmFieldFileId,
        })
        .then(() =>
          clientAPI.post(`api/resource-manager-field-file/${rmFieldFileId}/references/export`, { user_id: userId })
        ),
    queryKey: [UserMSResourcesQueryKey, msFieldId, userId],
    ...options,
  });
};
