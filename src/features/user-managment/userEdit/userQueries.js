import { useDispatch, useSelector } from "react-redux";

import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useGenericMutation } from "api/useGenericMutation";

import appSlice from "app/slices/appSlice";
import { selectCurrentManager } from "app/selectors/userSelectors";
import { useFileQuery } from "../../../api/file/useFileQueries";

const ApplicationQueryKey = createQueryKey("Application");

const ApplicationQueryKeys = {
  all: () => [ApplicationQueryKey],
  byId: (applicationId) => [...ApplicationQueryKeys.all(), { applicationId }],
  valuesById: (applicationId) => [...ApplicationQueryKeys.byId(applicationId), "values"],

  file: ({ applicationId, msFieldId, fileId }) => [
    ...ApplicationQueryKeys.byId(applicationId),
    "file",
    { msFieldId, fileId },
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

export const useCreateApplicationUserFilesMutation = ({ applicationId }, options) => {
  return useGenericMutation(
    {
      method: "post",
      url: `api/dform/${applicationId}/user-files`,
      queryKey: ApplicationQueryKeys.valuesById(applicationId),
    },
    options
  );
};

export const useDeleteApplicationUserFileMutation = ({ applicationId }, options) => {
  return useGenericMutation(
    {
      method: "delete",
      url: `api/dform/${applicationId}/user-file`,
      queryKey: ApplicationQueryKeys.valuesById(applicationId),
    },
    options
  );
};

export const useApplicationFileQuery = ({ applicationId, msFieldId, fileId }, options) => {
  return useFileQuery(
    {
      url: `api/dform/${applicationId}/user-file-download?master_schema_field_id=${msFieldId}&file_id=${fileId}`,
      queryKey: ApplicationQueryKeys.file({ applicationId, msFieldId, fileId }),
    },
    options
  );
};
