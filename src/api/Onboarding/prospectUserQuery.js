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
} = appSlice.actions;

export const ProspectUserProfileQueryKey = createQueryKey("Prospect User profile");

export const ProspectUserProfileKeys = {
  all: () => [ProspectUserProfileQueryKey],
  survayPassing: ["Prospect User survay passing"],
  removeUserNotify: ["Prospect User remove notify"],
  submitdFormDataRequest: ["Prospect User submit dForm data"],
};

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

export const useSubmitdFormDataRequestMutation = (options = {}) => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => clientAPI["put"](`/api/dform/${payload.dForm.id}/submit-data`, payload.data),

    onSettled: () => {
      return queryClient.invalidateQueries([...ProspectUserProfileKeys.submitdFormDataRequest]);
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

// return useGenericMutation(
//   {
//     url: `/api/dform/${id}/submit-data`,
//     method: "put",
//     queryKey: [...ProspectUserProfileKeys.submitdFormDataRequest],
//   },
//   {
//     onError: (error) => {
//       console.log("useSubmitdFormDataRequestMutation ERROR", error);
//       dispatch(submitdFormDataError(error.message));
//     },
//     onSuccess: (data) => {
//       console.log("useSubmitdFormDataRequestMutation SUCCESSFUL", data);
//       dispatch(submitdFormDataSuccess(data));
//     },
//   }
// );
