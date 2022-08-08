import { createQueryKey } from "api/createQueryKey";

import { useGenericQuery } from "api/useGenericQuery";

import { useDispatch } from "react-redux";

import { useGenericMutation } from "api/useGenericMutation";

import { useMutation } from "react-query";

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

export const MVAProfileQueryKey = createQueryKey("MVA User Profile");
export const MVAProfileQueryKeys = {
  all: () => [MVAProfileQueryKey],
};

export const useProspectUserProfileQuery = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/user/profile`,
      queryKey: MVAProfileQueryKeys.all(),
    },
    {
      onError: (error) => dispatch(getProfileError(error.message)),
      ...options,
    }
  );
};

const MVADFormsQueryKey = createQueryKey("MVA DForms");
const MVADFormsQueryKeys = {
  all: () => [MVADFormsQueryKey],
  dFormById: (id) => [...MVADFormsQueryKeys.all(), id],
};

export const useDFormsQuery = (options = {}) => {
  return useGenericQuery(
    {
      url: `/member-view-api/dform`,
      queryKey: MVADFormsQueryKeys.all(),
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
      queryKey: MVADFormsQueryKeys.dFormById(id),
    },
    {
      ...options,
    }
  );
};

export const useSubmitDFormDataRequestMutation = ({ dFormId }, options = {}) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    {
      method: "put",
      url: `/member-view-api/dform/${dFormId}/submit-data`,
    },
    {
      onError: (error) => dispatch(submitdFormDataError(error.message)),
      onSuccess: (data) => dispatch(submitdFormDataSuccess(data)),
      ...options,
    }
  );
};

export const useSubmitDFormPathRequestMutation = ({ dFormId }, options = {}) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    {
      method: "put",
      url: `/member-view-api/dform/${dFormId}/submit`,
    },
    {
      onError: (error) => dispatch(submitdFormError(error.message)),
      onSuccess: (data) => dispatch(submitdFormSuccess(data)),
      ...options,
    }
  );
};

export const MVASurveyPassingQueryKey = createQueryKey("MVA Survey Passing");
export const MVASurveyPassingQueryKeys = {
  all: () => [MVASurveyPassingQueryKey],
  surveyById: (id) => [...MVASurveyPassingQueryKeys.all(), id],
};

export const useSurveyPassingQuery = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/survey-passing`,
      queryKey: MVASurveyPassingQueryKeys.all(),
    },
    {
      onError: (error) => dispatch(getAssignedSurveysForOnboardingError(error.message)),
      onSuccess: (data) => dispatch(getAssignedSurveysForOnboardingSuccess(data)),
      ...options,
    }
  );
};

export const useSurveyByIdQuery = (payload, options = {}) => {
  const { id } = payload;
  return useGenericQuery(
    {
      url: `/member-view-api/survey-passing/${id}`,
      queryKey: MVASurveyPassingQueryKeys.surveyById(id),
    },
    {
      ...options,
    }
  );
};

export const MVABeginSurveyQueryKey = createQueryKey("MVA Begin Survey");
export const MVABeginSurveyQueryKeys = {
  all: () => [MVABeginSurveyQueryKey],
  beginSurvey: (id) => [...MVABeginSurveyQueryKeys.all(), id],
};
export const useGetBeginSurveyQuery = (payload, options = {}) => {
  const { id } = payload;

  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `member-view-api/survey-passing/${id}/begin`,
      queryKey: MVABeginSurveyQueryKeys.beginSurvey(id),
    },
    {
      onError: (error) => dispatch(beginSurveyError(error.message)),
      onSuccess: (data) => dispatch(beginSurveySuccess(data)),
      ...options,
    }
  );
};

export const MVANotifyIntroductionPageQueryKey = createQueryKey("MVA Notify Introduction Page");

export const MVANotifyIntroductionPageQueryKeys = {
  all: () => [MVANotifyIntroductionPageQueryKey],
  notifyIntroductionPageBuId: (id) => [...MVANotifyIntroductionPageQueryKeys.all(), id],
};

export const useNotifyIntroductionPageSeeingMutation = (payload, options = {}) => {
  const dispatch = useDispatch();

  const { userId, userNotifyEntryId } = payload;

  return useGenericMutation(
    {
      url: `/member-view-api/user/${userId}/notify-entries/${userNotifyEntryId}/notified`,
      method: "patch",
      queryKey: MVANotifyIntroductionPageQueryKeys.notifyIntroductionPageBuId(userNotifyEntryId),
    },
    {
      onError: (error) => dispatch(removeUserNotifyError(error.message)),
    }
  );
};

export const MVACurrentQuestionQueryKey = createQueryKey("MVA Current Question");
export const MVACurrentQuestionQueryKeys = {
  all: () => [MVACurrentQuestionQueryKey],
  byId: (id) => [...MVACurrentQuestionQueryKeys.all(), id],
};

export const useGetCurrentQuestionForAssignedSurveyQuery = (payload, options = {}) => {
  const { id } = payload;

  const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/survey-passing/${id}/current-question`,
      queryKey: MVACurrentQuestionQueryKeys.byId(id),
    },
    {
      onError: (error) => dispatch(getCurrentQuestionForAssignedSurveyError(error.message)),
      ...options,
    }
  );
};

export const useSwitchToPreviousQuestionMutation = (payload, options = {}) => {
  const dispatch = useDispatch();

  const { id } = payload;

  return useGenericMutation(
    {
      url: `/member-view-api/survey-passing/${id}/make-previous-question-current`,
      method: "put",
      queryKey: MVACurrentQuestionQueryKeys.byId(id),
    },
    {
      onError: (error) => dispatch(switchToPreviousQuestionError(error.message)),
      ...options,
    }
  );
};

export const usePushAnswerMutation = (options = {}) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => clientAPI["put"](`/member-view-api/survey-passing/${payload.surveyId}`, payload.data),
    onError: (error) => dispatch(pushAnswerError(error.message)),
    onSuccess: (data) => dispatch(pushAnswerSuccess()),
    ...options,
  });
};

export const MVAAllSurveyQuestionsQueryKey = createQueryKey("MVA All Survay Questions");

export const MVAAllSurveyQuestionsQueryKeys = {
  all: () => [MVAAllSurveyQuestionsQueryKey],
  surveyQuestionsId: (id) => [...MVAAllSurveyQuestionsQueryKeys.all(), id],
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
      onError: (error) => dispatch(getAllSurveyQuestionsError(error.message)),
      ...options,
    }
  );
};
