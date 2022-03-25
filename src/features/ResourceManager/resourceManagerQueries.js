import { useQuery } from "react-query";

import { clientAPI } from "api/clientAPI";
import { useGenericMutation } from "api/useGenericMutation";
import { normalizeHierarchy } from "api/masterSchema/normalizers";

import { downloadBlob } from "services/files.service";

export const useResourceManagers = (options = {}) => {
  return useQuery({
    queryKey: "resource-managers",
    queryFn: ({ signal }) => clientAPI.get("api/resource-manager", { signal }),
    ...options,
  });
};

export const useRMHierarchy = ({ resourceManagerId }, options = {}) => {
  return useQuery({
    queryKey: ["resource-managers-hierarchy", resourceManagerId],
    queryFn: ({ signal }) =>
      clientAPI
        .get(`api/resource-manager/${resourceManagerId}/hierarchy`, { signal })
        .then((data) => (data ? normalizeHierarchy(data) : null)),

    ...options,
  });
};

export const useCreateRMField = ({ resourceManagerId }) => {
  return useGenericMutation({
    mutationFn: (data) => clientAPI.post("api/resource-manager-field", data),
    queryKey: ["resource-managers-hierarchy", resourceManagerId],
  });
};

export const useCreateRMGroup = ({ resourceManagerId }) => {
  return useGenericMutation({
    mutationFn: (data) => clientAPI.post("api/resource-manager-directory", data),
    queryKey: ["resource-managers-hierarchy", resourceManagerId],
  });
};

export const useRMFieldFiles = ({ fieldId, assigned = false }, options = {}) => {
  return useQuery({
    queryKey: ["resource-manager-field-files", fieldId, assigned],
    queryFn: ({ signal }) =>
      clientAPI.get(`api/resource-manager-field-file`, {
        signal,
        params: {
          resource_manager_field_id: fieldId,
          ...(assigned ? { filter: "assigned-users" } : {}),
        },
      }),
    ...options,
  });
};

export const useRMFieldFileReferences = ({ fileId }, options = {}) => {
  return useQuery({
    queryKey: ["resource-manager-field-file/references", fileId],
    queryFn: ({ signal }) => clientAPI.get(`api/resource-manager-field-file/${fileId}/references`, { signal }),
    enabled: !!fileId,
    ...options,
  });
};

export const useRMFieldFileReferenceUsers = ({ fileId }, options = {}) => {
  return useQuery({
    queryKey: ["resource-manager-field-file/references/users", fileId],
    queryFn: ({ signal }) => clientAPI.get(`/api/resource-manager-field-file/${fileId}/references/users`, { signal }),
    enabled: !!fileId,
    ...options,
  });
};

// ToDo: move it to master schema queries
export const useMSUserFields = ({ userId }, options = {}) => {
  return useQuery({
    queryKey: ["master-schema-user-fields", userId],
    queryFn: ({ signal }) => clientAPI.get(`/api/master-schema-field`, { signal, params: { user_id: userId } }),
    enabled: !!userId,
    ...options,
  });
};

export const useSaveMappingReference = ({ fileId }, options = {}) => {
  return useGenericMutation({
    mutationFn: (data) => clientAPI.put(`api/resource-manager-field-file/${fileId}/references`, data),
    queryKey: ["resource-manager-field-file/references", fileId],
    ...options,
  });
};

export const useOpenRMFilePreview = ({ fileId, userId }, options = {}) => {
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

export const useExportRMFileToMS = ({ fileId, userId }, options = {}) => {
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

export const useUploadRMFile = ({ fieldId }, options = {}) => {
  return useGenericMutation({
    mutationFn: (data) => clientAPI.post("api/resource-manager-field-file", data),
    queryKey: ["resource-manager-field-files", fieldId],
    ...options,
  });
};

export const useDownloadRMFile = ({ fileId, name }, options = {}) => {
  return useGenericMutation({
    mutationFn: () =>
      clientAPI
        .get(`api/resource-manager-field-file/${fileId}/download`, {
          responseType: "blob",
          onlyData: false,
          flatData: false,
        })
        .then((response) => downloadBlob(response.data, name)),
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
    mutationFn: () => clientAPI.delete(`api/resource-manager-field-file/${fileId}`),
    queryKey: ["resource-manager-field-files", fieldId],
    ...options,
  });
};

export const useFinishRMFile = ({ fileId, fieldId }, options = {}) => {
  return useGenericMutation({
    mutationFn: () => clientAPI.post(`api/resource-manager-field-file/${fileId}/finish-editing`),
    queryKey: ["resource-manager-field-files", fieldId],
    ...options,
  });
};
