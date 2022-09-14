import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useFileQuery } from "api/file/useFileQueries";
import { useGenericMutation } from "api/useGenericMutation";

import appSlice from "app/slices/appSlice";
import { selectCurrentManager } from "app/selectors/userSelectors";

const ApplicationQueryKey = createQueryKey("Application");

const ApplicationQueryKeys = {
  all: () => [ApplicationQueryKey],
  byId: (dFormId) => [...ApplicationQueryKeys.all(), { dFormId }],
  valuesById: (dFormId) => [...ApplicationQueryKeys.byId(dFormId), "values"],

  files: ({ dFormId, masterSchemaFieldId }) => [
    ...ApplicationQueryKeys.valuesById(dFormId),
    "files",
    { masterSchemaFieldId },
  ],
  file: ({ dFormId, masterSchemaFieldId, fileId }) => [
    ...ApplicationQueryKeys.files({ dFormId, masterSchemaFieldId }),
    { fileId },
  ],
};

export const useUserApplication = ({ userApplicationId }, options) => {
  return useGenericQuery(
    {
      url: `/api/dform/${userApplicationId}`,
      queryKey: ApplicationQueryKeys.byId(userApplicationId),
    },
    options
  );
};

export const useUserApplicationValues = ({ userApplicationId }, options) => {
  return useGenericQuery(
    {
      url: `api/dform/${userApplicationId}/user-values`,
      queryKey: ApplicationQueryKeys.valuesById(userApplicationId),
    },
    options
  );
};

const { getUserByIdRequest } = appSlice.actions;

export const useUserApplicationStatusMutation = ({ userApplicationId }, options) => {
  return useGenericMutation(
    {
      url: `/api/dform/${userApplicationId}/change-status`,
      method: "put",
      queryKey: ApplicationQueryKeys.byId(userApplicationId),
    },
    options
  );
};

export const useUserApplicationValuesMutation = ({ userApplicationId }, options) => {
  const dispatch = useDispatch();
  const manager = useSelector(selectCurrentManager);

  return useGenericMutation(
    {
      url: `/api/dform/${userApplicationId}/new-version-by-data`,
      method: "post",
      queryKey: ApplicationQueryKeys.byId(userApplicationId),
    },
    {
      ...options,
      onSuccess: (...args) => {
        if (typeof options.onSuccess === "function") {
          options.onSuccess(...args);
        }
        // Update current app.user.manager
        dispatch(getUserByIdRequest({ userId: manager.id }));
      },
    }
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
      queryKey: ApplicationQueryKeys.file({ dFormId, masterSchemaFieldId, fileId }),
      shouldReadAsDataURL: false,
    },
    options
  );
};
