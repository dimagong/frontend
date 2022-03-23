import { useQuery } from "react-query";

import { clientAPI } from "api/clientAPI";
import { useGenericMutation } from "api/useGenericMutation";

export const useMSUserResource = ({ msFieldId, userId }, options = {}) => {
  return useQuery({
    queryKey: ["user-resource", msFieldId, userId],
    queryFn: ({ signal }) =>
      clientAPI.get("/api/user-resource", { signal, params: { master_schema_field_id: msFieldId, user_id: userId } }),
    ...options,
  });
};

export const useUserResourceFields = ({ userId }, options = {}) => {
  return useQuery({
    queryKey: ["user-resource-fields", userId],
    queryFn: ({ signal }) => clientAPI.get("/api/user-resource/fields", { signal, params: { user_id: userId } }),
    ...options,
  });
};

export const useUserResourceFieldFiles = ({ rmFieldId, userId }, options = {}) => {
  return useQuery({
    queryKey: ["user-resource-field-files", rmFieldId, userId],
    queryFn: ({ signal }) =>
      clientAPI.get(`/api/user-resource/fields/${rmFieldId}/files`, { signal, params: { user_id: userId } }),
    enabled: !!(rmFieldId && userId),
    ...options,
  });
};

export const useAttachRMFileToMS = ({ msFieldId, userId }, options = {}) => {
  return useGenericMutation({
    mutationFn: ({ rmFieldFileId }) =>
      clientAPI.put("api/user-resource", {
        user_id: userId,
        master_schema_field_id: msFieldId,
        resource_manager_field_file_id: rmFieldFileId,
      }),
    queryKey: ["user-resource", msFieldId, userId],
    ...options,
  });
};
