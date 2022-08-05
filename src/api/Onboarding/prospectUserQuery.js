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
  submitdFormDataError,
  submitdFormDataSuccess,
  submitdFormError,
  submitdFormSuccess,
  getCurrentQuestionForAssignedSurveyError,
  getProfileError,
  beginSurveyError,
  beginSurveySuccess,
  pushAnswerError,
  pushAnswerSuccess,
  switchToPreviousQuestionError,
  getAllSurveyQuestionsError,
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
  switchToPreviousQuestion: ["Prospect User switch to previouse question"],
  switchToPreviousQuestionId: (id) => [...ProspectUserProfileKeys.switchToPreviousQuestion, id],
};

export const useProspectUserProfileQuery = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/user/profile`,
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
    {
      url: `/member-view-api/dform`,
      queryKey: ProspectUserProfileKeys.dFormsList,
    },
    {
      ...options,
    }
  );
};

export const useDFormByIdQuery = (payload, options = {}) => {
  const { id } = payload;
  return useGenericQuery(
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
      queryKey: ProspectUserProfileKeys.surveyPassingById(id),
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
      url: `member-view-api/survey-passing/${id}/current-question`,
      queryKey: ProspectUserProfileKeys.currentQuestionForAssignedSurveyId(id),
    },
    {
      onError: (error) => {
        dispatch(getCurrentQuestionForAssignedSurveyError(error.message));
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

export const useSwitchToPreviousQuestionMutation = (payload, options = {}) => {
  const dispatch = useDispatch();

  const { id } = payload;

  return useGenericMutation(
    {
      url: `/member-view-api/survey-passing/${id}/make-previous-question-current`,
      method: "put",
      queryKey: ProspectUserProfileKeys.switchToPreviousQuestionId(id),
    },
    {
      onError: (error) => {
        console.log("useSwitchToPreviousQuestionMutation ERROR", error.message);
        dispatch(switchToPreviousQuestionError(error.message));
      },
      onSuccess: (data) => {
        console.log("useSwitchToPreviousQuestionMutation SUCCESS", data);
      },
      ...options,
    }
  );
};

export const MVAAllSurveyQuestionsQueryKey = createQueryKey("MVA all survay questions");

export const MVAAllSurveyQuestionsQueryKeys = {
  all: () => [MVAAllSurveyQuestionsQueryKey],
  surveyQuestionsId: (id) => [MVAAllSurveyQuestionsQueryKeys.all, id],
};

export const useGetAllSurveyQuestionsQuery = (payload, options = {}) => {
  const { id } = payload;

  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `member-view-api/survey-passing/${id}/questions`,
      queryKey: MVAAllSurveyQuestionsQueryKeys.surveyQuestionsId(id),
    },
    {
      onError: (error) => {
        dispatch(getAllSurveyQuestionsError(error.message));
      },
      ...options,
    }
  );
};
