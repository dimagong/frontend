import { createQueryKey } from "api/createQueryKey";

import { useGenericQuery } from "api/useGenericQuery";

import { useDispatch } from "react-redux";

import { useGenericMutation } from "api/useGenericMutation";

import appSlice from "app/slices/appSlice";

const {
  getAssignedSurveysForOnboardingSuccess,
  getAssignedSurveysForOnboardingError,
  removeUserNotifyError,
  removeUserNotifySuccess,
} = appSlice.actions;

export const ProspectUserProfileQueryKey = createQueryKey("Prospect User profile");
export const ProspectUserSurvayPassingQueryKey = createQueryKey("Prospect User Survay Passing");
export const ProspectRemoveUserNotifyQueryKey = createQueryKey("Prospect User Remove Notify");

export const ProspectUserProfileKeys = {
  all: () => [ProspectUserProfileQueryKey],
};

export const ProspectUserSurvayKeys = {
  all: () => [ProspectUserSurvayPassingQueryKey],
};

export const ProspectRemoveUserNotifyQueryKeys = {
  all: () => [ProspectRemoveUserNotifyQueryKey],
};

export const useProspectUserProfileQuery = (options = {}) => {
  return useGenericQuery(
    {
      url: `/member-view-api/user/profile`,
      queryKey: [...ProspectUserProfileKeys.all()],
    },
    {
      onError: (error) => {
        console.log("ERROR useProspectUserProfileQuery", error);
      },
      onSuccess: (data) => {
        console.log("SUCCESS useProspectUserProfileQuery", data);
      },
      ...options,
    }
  );
};

export const useSurvayPassingQuery = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/survey-passing`,
      queryKey: [...ProspectUserSurvayKeys.all()],
    },
    {
      onError: (error) => {
        console.log("ERROR useSurvayPassingQuery", error);
        dispatch(getAssignedSurveysForOnboardingError(error.message));
      },
      onSuccess: (data) => {
        console.log("SUCCESS useSurvayPassingQuery", data);
        dispatch(getAssignedSurveysForOnboardingSuccess(data));
      },
      ...options,
    }
  );
};

export const useProspectRemoveUserNotifyMutation = (payload, options = {}) => {
  const dispatch = useDispatch();

  const { userId, userNotifyEntryId } = payload;

  return useGenericMutation(
    {
      url: `/api/user/${userId}/notify-entries/${userNotifyEntryId}/notified`,
      method: "patch",
      queryKey: [...ProspectRemoveUserNotifyQueryKeys.all()],
    },
    {
      onError: (error) => {
        console.log("useProspectRemoveUserNotifyMutation ERROR", error);
        dispatch(removeUserNotifyError(error.message));
      },
      onSuccess: (data) => {
        console.log("useProspectRemoveUserNotifyMutation SUCCESSFUL", data);
        dispatch(removeUserNotifySuccess());
      },
    }
  );
};
