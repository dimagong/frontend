import { useDispatch, useSelector } from "react-redux";

import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useFileQuery } from "api/file/useFileQueries";
import { useGenericMutation } from "api/useGenericMutation";

import appSlice from "app/slices/appSlice";
import { selectCurrentManager } from "app/selectors/userSelectors";

// DForm's Queries/Mutations

export const DFormQueryKey = createQueryKey("DForm");

export const DFormQueryKeys = {
  all: () => [DFormQueryKey],
  byId: (dFormId) => [...DFormQueryKeys.all(), { dFormId }],
  valuesById: (dFormId) => [...DFormQueryKeys.byId(dFormId), "values"],

  files: ({ dFormId, masterSchemaFieldId }) => [
    ...DFormQueryKeys.valuesById(dFormId),
    "files",
    { masterSchemaFieldId },
  ],
  file: ({ dFormId, masterSchemaFieldId, fileId }) => [
    ...DFormQueryKeys.files({ dFormId, masterSchemaFieldId }),
    { fileId },
  ],
};

export const useDFormQuery = ({ dformId }, options = {}) => {
  const dispatch = useDispatch();
  const manager = useSelector(selectCurrentManager);

  return useGenericQuery(
    {
      url: `/api/dform/${dformId}`,
      queryKey: DFormQueryKeys.byId(dformId),
    },
    {
      ...options,
      onSuccess: (data, ...args) => {
        options.onSuccess && options.onSuccess(data, ...args);
        dispatch(getUserByIdRequest({ userId: manager.id }));
        dispatch(submitdFormNewVersionSuccess({ ...data, managerId: manager.id }));
      },
    }
  );
};

export const useDFormValues = ({ dformId }, options) => {
  return useGenericQuery(
    {
      url: `api/dform/${dformId}/user-values`,
      queryKey: DFormQueryKeys.valuesById(dformId),
    },
    options
  );
};

const { getUserByIdRequest, submitdFormNewVersionSuccess } = appSlice.actions;

export const useChangeDFormStatusMutation = ({ dformId }, options) => {
  return useGenericMutation(
    {
      url: `/api/dform/${dformId}/change-status`,
      method: "put",
      queryKey: DFormQueryKeys.byId(dformId),
    },
    options
  );
};

export const useSubmitDFormMutation = ({ dformId }, options) => {
  return useGenericMutation(
    {
      url: `/api/dform/${dformId}/new-version-by-data`,
      method: "post",
      queryKey: DFormQueryKeys.byId(dformId),
    },
    options
  );
};

// Application Files

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
      queryKey: DFormQueryKeys.file({ dFormId, masterSchemaFieldId, fileId }),
      shouldReadAsDataURL: false,
    },
    options
  );
};
