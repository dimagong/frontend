import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";

const { getAssignedSurveysForOnboardingSuccess, getAssignedSurveysForOnboardingError } = appSlice.actions;

export const ProspectUserProfileQueryKey = createQueryKey("Prospect User profile");
export const ProspectUserSurvayPassingQueryKey = createQueryKey("Prospect User Survay Passing");

export const ProspectUserProfileKeys = {
  all: () => [ProspectUserProfileQueryKey],
};

export const ProspectUserSurvayKeys = {
  all: () => [ProspectUserSurvayPassingQueryKey],
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
