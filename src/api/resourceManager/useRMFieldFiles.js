import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";
import { useGenericMutation } from "../useGenericMutation";

import { downloadBlob } from "../../services/files.service";

export const RMFieldFilesQueryKey = "resource-manager-field-files";

export const useRMFieldFiles = ({ fieldId }, options = {}) => {
  return useQuery({
    queryKey: [RMFieldFilesQueryKey, fieldId],
    queryFn: ({ signal }) =>
      clientAPI.get(`api/resource-manager-field-file`, {
        signal,
        params: {
          resource_manager_field_id: fieldId
        },
      }),
    ...options,
  });
};

export const useUploadRMFile = ({ fieldId }, options = {}) => {
  return useGenericMutation({
    queryKey: [RMFieldFilesQueryKey, fieldId],
    mutationFn: (data) => clientAPI.post("api/resource-manager-field-file", data),
    ...options,
  });
};

export const useDownloadRMFile = ({ fileId, filename }, options = {}) => {
  return useGenericMutation({
    mutationFn: () => clientAPI
      .get(`api/resource-manager-field-file/${fileId}/download`, {
        responseType: "blob",
        onlyData: false,
        flatData: false,
        flatError: false,
      })
      .then((response) => downloadBlob(response.data, filename)),
    ...options,
  });
};

export const useEditRMFile = ({ fileId }, options = {}) => {
  return useGenericMutation({
    mutationFn: () =>
      clientAPI
        .post(`api/resource-manager-field-file/${fileId}/start-editing`, {
          onlyData: false,
          flatData: false,
        })
        .then((response) => {
          if (response.status === "forbidden") {
            window.open(response.message, "_blank");
          } else {
            window.open(response.google_drive_doc.file.webViewLink, "_blank");
          }
        }),
    ...options,
  });
};

export const useDeleteRMFile = ({ fileId, fieldId }, options = {}) => {
  return useGenericMutation({
    queryKey: [RMFieldFilesQueryKey, fieldId],
    mutationFn: () => clientAPI.delete(`api/resource-manager-field-file/${fileId}`),
    ...options,
  });
};

export const useFinishRMFile = ({ fileId, fieldId }, options = {}) => {
  return useGenericMutation({
    queryKey: [RMFieldFilesQueryKey, fieldId],
    mutationFn: () => clientAPI.post(`api/resource-manager-field-file/${fileId}/finish-editing`),
    ...options,
  });
};
