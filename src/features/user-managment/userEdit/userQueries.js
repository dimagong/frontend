import { createQueryKey } from "../../../api/createQueryKey";
import { useGenericQuery } from "../../../api/useGenericQuery";
import { useGenericMutation } from "../../../api/useGenericMutation";

export const GetUserApplicationQueryKey = createQueryKey("Get user application query key");
export const GetUserApplicationValuesQueryKey = createQueryKey("Get user application values query key");
export const UpdateUserApplicationStatusQueryKey = createQueryKey("Update user application status query key");
export const UpdateUserApplicationValuesQueryKey = createQueryKey("Update user application values query key");

export const UserQueryKeys = {
  all: () => [GetUserApplicationQueryKey, UpdateUserApplicationStatusQueryKey],
  getUserApplication: ({ userApplicationId }) => [GetUserApplicationQueryKey, { userApplicationId }],
  getUserApplicationValues: ({ userApplicationId }) => [GetUserApplicationValuesQueryKey, { userApplicationId }],
  updateUserApplicationStatus: ({ userApplicationId }) => [UpdateUserApplicationStatusQueryKey, { userApplicationId }],
  updateUserApplicationValues: ({ userApplicationId }) => [UpdateUserApplicationValuesQueryKey, { userApplicationId }],
};

export const useUserApplication = ({ userApplicationId }, options) =>
  useGenericQuery(
    {
      url: `/api/dform/${userApplicationId}`,
      queryKey: UserQueryKeys.getUserApplication({ userApplicationId }),
    },
    options
  );

export const useUserApplicationValues = ({ userApplicationId }, options) =>
  useGenericQuery(
    {
      url: `api/dform/${userApplicationId}/user-values`,
      queryKey: UserQueryKeys.getUserApplicationValues({ userApplicationId }),
    },
    options
  );

export const useUserApplicationStatusMutation = ({ userApplicationId }, options) =>
  useGenericMutation(
    {
      url: `/api/dform/${userApplicationId}/change-status`,
      method: "put",
      queryKey: UserQueryKeys.updateUserApplicationStatus({ userApplicationId }),
    },
    options
  );

export const useUserApplicationValuesMutation = ({ userApplicationId }, options) =>
  useGenericMutation(
    {
      url: `/api/dform/${userApplicationId}/new-version-by-data`,
      method: "post",
      queryKey: UserQueryKeys.updateUserApplicationValues({ userApplicationId }),
    },
    options
  );
