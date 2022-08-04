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
  getCurrentQuestionForAssignedSurveyError,
  getCurrentQuestionForAssignedSurveySuccess,
  getProfileError,
  beginSurveyError,
  beginSurveySuccess,
  pushAnswerError,
  pushAnswerSuccess,
} = appSlice.actions;

export const ProspectUserProfileQueryKey = createQueryKey("Prospect User profile");

export const ProspectUserProfileKeys = {
  all: () => [ProspectUserProfileQueryKey],
  surveyPassing: ["Prospect User survey passing"],
  surveyPassingById: (id) => [...ProspectUserProfileKeys.surveyPassing, id],
  removeUserNotify: ["Prospect User remove notify"],
  submitdFormData: ["Prospect User submit dFormData"],
  submitdFormPath: ["Prospect User submit dFormPath"],
  currentQuestionForAssignedSurvey: ["Prospect User current question for assigned survey"],
  currentQuestionForAssignedSurveyId: (id) => [...ProspectUserProfileKeys.currentQuestionForAssignedSurvey, id],
  beginSurvey: ["Prospect User begin survey"],
  beginSurveyId: (id) => [...ProspectUserProfileKeys.beginSurvey, id],
  dFormsList: ["Prospect User dforms list"],
  dFormsListById: (id) => [...ProspectUserProfileKeys.dFormsList, id],
};

export const useProspectUserProfileQuery = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/user/profile`,
      //url: `/api/user/profile`,
      queryKey: ProspectUserProfileKeys.all(),
    },
    {
      onError: (error) => {
        dispatch(getProfileError(error.message));
      },
      ...options,
    }
  );
};

export const useDFormsListQuery = (options = {}) => {
  return useGenericQuery(
    //localhost/member-view-api/dform
    //member-view-api/user/onboardings
    {
      url: `/member-view-api/dform`,
      queryKey: ProspectUserProfileKeys.dFormsList,
    },
    {
      ...options,
    }
  );
};

//useAppsOnboardingIdQuery
export const useDFormByIdQuery = (payload, options = {}) => {
  const { id } = payload;
  return useGenericQuery(
    ///member-view-api/user/onboardings/${id}
    {
      url: `/member-view-api/dform/${id}`,
      queryKey: ProspectUserProfileKeys.dFormsListById(id),
    },
    {
      ...options,
    }
  );
};

export const useSurveyPassingQuery = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/survey-passing`,
      // url: `/api/survey-passing`,
      queryKey: ProspectUserProfileKeys.surveyPassing,
    },
    {
      onError: (error) => {
        dispatch(getAssignedSurveysForOnboardingError(error.message));
      },
      onSuccess: (data) => {
        dispatch(getAssignedSurveysForOnboardingSuccess(data));
      },
      ...options,
    }
  );
};

export const useSurveyByIdQuery = (payload, options = {}) => {
  const { id } = payload;
  return useGenericQuery(
    {
      url: `/member-view-api/survey-passing/${id}`,
      queryKey: ProspectUserProfileKeys.surveyPassingById,
    },
    {
      ...options,
    }
  );
};

export const useProspectRemoveUserNotifyMutation = (payload, options = {}) => {
  const dispatch = useDispatch();

  const { userId, userNotifyEntryId } = payload;

  return useGenericMutation(
    {
      //`/api/user/${userId}/notify-entries/${userNotifyEntryId}/notified`
      url: `/member-view-api/user/${userId}/notify-entries/${userNotifyEntryId}/notified`,
      method: "patch",
      queryKey: ProspectUserProfileKeys.removeUserNotify,
    },
    {
      onError: (error) => {
        dispatch(removeUserNotifyError(error.message));
      },
      onSuccess: (data) => {
        //dispatch(removeUserNotifySuccess());
      },
    }
  );
};

export const useSubmitdFormDataRequestMutation = (options = {}) => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  return useMutation({
    //api/dform/${payload.dForm.id}/submit-data
    mutationFn: (payload) => clientAPI["put"](`/member-view-api/dform/${payload.dForm.id}/submit-data`, payload.data),

    onSettled: () => {
      return queryClient.invalidateQueries(ProspectUserProfileKeys.submitdFormData);
    },
    onError: (error) => {
      dispatch(submitdFormDataError(error.message));
    },
    onSuccess: (data) => {
      dispatch(submitdFormDataSuccess(data));
    },

    ...options,
  });
};

export const useSubmitdFormPathRequestMutation = (options = {}) => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  return useMutation({
    //api/dform/${payload.dForm.id}/submit
    mutationFn: (payload) => clientAPI["put"](`/member-view-api/dform/${payload.dForm.id}/submit`, payload.data),

    onSettled: () => {
      return queryClient.invalidateQueries(ProspectUserProfileKeys.submitdFormPath);
    },
    onError: (error) => {
      dispatch(submitdFormError(error.message));
    },
    onSuccess: (data) => {
      dispatch(submitdFormSuccess(data));
    },
    ...options,
  });
};

export const useGetCurrentQuestionForAssignedSurvey = (payload, options = {}) => {
  const { id } = payload;

  const dispatch = useDispatch();
  return useGenericQuery(
    {
      //api/survey-passing/${id}/current-question
      url: `member-view-api/survey-passing/${id}/current-question`,
      queryKey: ProspectUserProfileKeys.currentQuestionForAssignedSurveyId(id),
    },
    {
      onError: (error) => {
        //dispatch(getCurrentQuestionForAssignedSurveyError(error.message));
      },
      onSuccess: (data) => {
        //dispatch(getCurrentQuestionForAssignedSurveySuccess(data));
      },
      ...options,
    }
  );
};

export const useGetBeginSurveyQuery = (payload, options = {}) => {
  const { id } = payload;

  const dispatch = useDispatch();
  return useGenericQuery(
    {
      //member-view-api/survey-passing/${id}/begin
      //api/survey-passing/${id}/begin
      url: `member-view-api/survey-passing/${id}/begin`,
      queryKey: ProspectUserProfileKeys.beginSurveyId(id),
    },
    {
      onError: (error) => {
        dispatch(beginSurveyError(error.message));
      },
      onSuccess: (data) => {
        dispatch(beginSurveySuccess(data));
      },
      ...options,
    }
  );
};

export const usePushAnswerMutation = (options = {}) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => clientAPI["put"](`/member-view-api/survey-passing/${payload.surveyId}`, payload.data),

    onSettled: () => {
      //return queryClient.invalidateQueries(ProspectUserProfileKeys.something);
    },
    onError: (error) => {
      dispatch(pushAnswerError(error.message));
    },
    onSuccess: (data) => {
      dispatch(pushAnswerSuccess());
    },
    ...options,
  });
};
