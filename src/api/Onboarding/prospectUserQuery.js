import { createQueryKey } from "api/createQueryKey";

import { useGenericQuery } from "api/useGenericQuery";

import { useDispatch } from "react-redux";

import { useGenericMutation } from "api/useGenericMutation";

import { useMutation, useQueryClient } from "react-query";

import appSlice from "app/slices/appSlice";

import { clientAPI } from "api/clientAPI";

const {
  getAssignedSurveysForOnboardingSuccess,
  getAssignedSurveysForOnboardingError,
  removeUserNotifyError,
  removeUserNotifySuccess,
  submitdFormDataError,
  submitdFormDataSuccess,
  submitdFormError,
  submitdFormSuccess,
} = appSlice.actions;

export const ProspectUserProfileQueryKey = createQueryKey("Prospect User profile");

export const ProspectUserProfileKeys = {
  all: () => [ProspectUserProfileQueryKey],
  survayPassing: ["Prospect User survay passing"],
  removeUserNotify: ["Prospect User remove notify"],
  submitdFormData: ["Prospect User submit dFormData"],
  submitdFormPath: ["Prospect User submit dFormPath"],
};

//! using outdated endpoint
export const useProspectUserProfileQuery = (options = {}) => {
  return useGenericQuery(
    {
      // url: `/member-view-api/user/profile`,
      url: `/api/user/profile`,
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

//! using outdated endpoint
export const useSurvayPassingQuery = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericQuery(
    {
      // url: `/member-view-api/survey-passing`,
      url: `/api/survey-passing`,
      queryKey: [...ProspectUserProfileKeys.survayPassing],
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

//! no new endpoint as member-view-api,  using outdated endpoint
export const useProspectRemoveUserNotifyMutation = (payload, options = {}) => {
  const dispatch = useDispatch();

  const { userId, userNotifyEntryId } = payload;

  return useGenericMutation(
    {
      url: `/api/user/${userId}/notify-entries/${userNotifyEntryId}/notified`,
      method: "patch",
      queryKey: [...ProspectUserProfileKeys.removeUserNotify],
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

//! using outdated endpoint
export const useSubmitdFormDataRequestMutation = (options = {}) => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  return useMutation({
    //member-view-api/dform/${payload.dForm.id}/submit-data
    mutationFn: (payload) => clientAPI["put"](`/api/dform/${payload.dForm.id}/submit-data`, payload.data),

    onSettled: () => {
      return queryClient.invalidateQueries([...ProspectUserProfileKeys.submitdFormData]);
    },
    onError: (error) => {
      console.log("useSubmitdFormDataRequestMutation ERROR", error);
      dispatch(submitdFormDataError(error.message));
    },
    onSuccess: (data) => {
      console.log("useSubmitdFormDataRequestMutation SUCCESSFUL", data);
      dispatch(submitdFormDataSuccess(data));
    },

    ...options,
  });
};

//! using outdated endpoint
export const useSubmitdFormPathRequestMutation = (options = {}) => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  return useMutation({
    //member-view-api/dform/${payload.dForm.id}/submit
    mutationFn: (payload) => clientAPI["put"](`/api/dform/${payload.dForm.id}/submit`, payload.data),

    onSettled: () => {
      return queryClient.invalidateQueries([...ProspectUserProfileKeys.submitdFormPath]);
    },
    onError: (error) => {
      console.log("useSubmitdFormPathRequestMutation ERROR", error);
      dispatch(submitdFormError(error.message));
    },
    onSuccess: (data) => {
      console.log("useSubmitdFormPathRequestMutation SUCCESSFUL", data);
      dispatch(submitdFormSuccess(data));
    },
    ...options,
  });
};
