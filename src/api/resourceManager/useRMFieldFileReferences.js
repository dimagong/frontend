import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";
import { useGenericMutationDeprecated } from "../useGenericMutation";

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
  return useGenericMutationDeprecated({
    mutationFn: (data) => clientAPI.put(`api/resource-manager-field-file/${fileId}/references`, data),
    queryKey: [RMFieldFileReferencesQueryKey, fileId],
    ...options,
  });
};

export const useOpenRMFileReferencesPreview = ({ fileId }, options = {}) => {
  return useGenericMutationDeprecated({
    mutationFn: ({ userId }) =>
      clientAPI
        .get(`api/resource-manager-field-file/${fileId}/references/preview`, {
          responseType: "blob",
          onlyData: false,
          flatData: false,
          flatError: false,
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
