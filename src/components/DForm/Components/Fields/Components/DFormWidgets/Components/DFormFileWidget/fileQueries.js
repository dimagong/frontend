import { createQueryKey } from "api/createQueryKey";
import { useFileQuery } from "api/file/useFileQueries";
import { useGenericMutation } from "api/useGenericMutation";

const DFormFileQueryKey = createQueryKey("DForm files");

const DFormFileQueryKeys = {
  all: ({ dFormId, masterSchemaFieldId }) => [DFormFileQueryKey, { dFormId, masterSchemaFieldId }],
  file: ({ dFormId, masterSchemaFieldId, fileId }) => [
    ...DFormFileQueryKeys.all({ dFormId, masterSchemaFieldId }),
    { fileId },
  ],
};

// MemberDForm

export const useCreateMVAUserFilesMutation = ({ dFormId }, options = {}) => {
  return useGenericMutation({ method: "post", url: `member-view-api/dform/${dFormId}/user-files` }, options);
};

export const useDeleteMVAUserFileMutation = ({ dFormId, fileId }, options) => {
  return useGenericMutation({ method: "delete", url: `member-view-api/dform/${dFormId}/user-file` }, options);
};

export const useMVAUserFileQuery = ({ dFormId, masterSchemaFieldId, fileId }, options) => {
  return useFileQuery(
    {
      url: `member-view-api/dform/${dFormId}/user-file-download?master_schema_field_id=${masterSchemaFieldId}&file_id=${fileId}`,
      queryKey: DFormFileQueryKeys.file({ dFormId, masterSchemaFieldId, fileId }),
      shouldReadAsDataURL: false,
    },
    options
  );
};

// ManagerDForm

export const useCreateApplicationUserFilesMutation = ({ dFormId }, options) => {
  return useGenericMutation({ method: "post", url: `api/dform/${dFormId}/user-files` }, options);
};

export const useDeleteApplicationUserFileMutation = ({ dFormId, fileId }, options) => {
  return useGenericMutation({ method: "delete", url: `api/dform/${dFormId}/user-file` }, options);
};

export const useApplicationUserFileQuery = ({ dFormId, masterSchemaFieldId, fileId }, options) => {
  return useFileQuery(
    {
      url: `api/dform/${dFormId}/user-file-download?master_schema_field_id=${masterSchemaFieldId}&file_id=${fileId}`,
      queryKey: DFormFileQueryKeys.file({ dFormId, masterSchemaFieldId, fileId }),
      shouldReadAsDataURL: false,
    },
    options
  );
};
