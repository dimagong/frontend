import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";
import { useGenericMutation } from "../useGenericMutation";

export const RMFieldFileReferencesQueryKey = "resource-manager-field-file-references";

export const useRMFieldFileReferences = ({ fileId }, options = {}) => {
  return useQuery({
    queryKey: [RMFieldFileReferencesQueryKey, fileId],
    queryFn: ({ signal }) => clientAPI.get(`api/resource-manager-field-file/${fileId}/references`, { signal }),
    enabled: !!fileId,
    ...options,
  });
};

export const useSaveRMFileReferences = ({ fileId }, options = {}) => {
  return useGenericMutation({
    mutationFn: (data) => clientAPI.put(`api/resource-manager-field-file/${fileId}/references`, data),
    queryKey: [RMFieldFileReferencesQueryKey, fileId],
    ...options,
  });
};

export const useOpenRMFileReferencesPreview = ({ fileId, userId }, options = {}) => {
  return useGenericMutation({
    mutationFn: () =>
      clientAPI
        .get(`api/resource-manager-field-file/${fileId}/references/preview`, {
          responseType: "blob",
          onlyData: false,
          flatData: false,
          params: {
            user_id: userId,
          },
        })
        .then((response) => {
          const url = window.URL.createObjectURL(response.data);

          window.open(url, "_blank");
        }),
    ...options,
  });
};

export const useExportRMFileReferencesToMS = ({ fileId, userId }, options = {}) => {
  return useGenericMutation({
    mutationFn: () =>
      clientAPI
        .post(`api/resource-manager-field-file/${fileId}/references/export`, { user_id: userId })
        .then((response) => {
          const url = window.URL.createObjectURL(response.data);

          window.open(url, "_blank");
        }),
    ...options,
  });
};
