import { useDispatch, useSelector } from "react-redux";

import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useGenericMutation } from "api/useGenericMutation";

import appSlice from "app/slices/appSlice";
import { selectCurrentManager } from "app/selectors/userSelectors";

const ApplicationQueryKey = createQueryKey("Application");

const ApplicationQueryKeys = {
  all: () => [ApplicationQueryKey],
  byId: (applicationId) => [...ApplicationQueryKeys.all(), { applicationId }],
  valuesById: (applicationId) => [...ApplicationQueryKeys.byId(applicationId), "values"],
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
