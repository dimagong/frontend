import { merge } from "lodash";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "react-query";

import { clientAPI } from "api/clientAPI";
import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useGenericMutation } from "api/useGenericMutation";

import appSlice from "app/slices/appSlice";
import { useFileQuery } from "../file/useFileQueries";

const {
  getAssignedSurveysForOnboardingSuccess,
  getAssignedSurveysForOnboardingError,
  removeUserNotifyError,
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

export const MVADFormsQueryKeys = {
  all: () => [MVADFormsQueryKey],
  dFormById: (dFormId) => [...MVADFormsQueryKeys.all(), { dFormId }],
  dFormValuesById: (dFormId) => [...MVADFormsQueryKeys.dFormById(dFormId), "values"],

  files: ({ dFormId, masterSchemaFieldId }) => [
    ...MVADFormsQueryKeys.dFormValuesById(dFormId),
    { masterSchemaFieldId },
    "files",
  ],
  file: ({ dFormId, masterSchemaFieldId, fileId }) => [
    ...MVADFormsQueryKeys.files({ dFormId, masterSchemaFieldId }),
    { fileId },
  ],
};

export const useDFormsQuery = (options) => {
  return useGenericQuery(
    {
      url: `/member-view-api/dform`,
      queryKey: MVADFormsQueryKeys.all(),
    },
    options
  );
};

export const useDFormsValuesByIdQuery = ({ dFormId }, options) => {
  return useGenericQuery(
    {
      url: `/member-view-api/dform/${dFormId}/user-values`,
      queryKey: MVADFormsQueryKeys.dFormValuesById(dFormId),
    },
    options
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

export const useSaveDFormFieldValue = ({ dFormId }, options) => {
  return useGenericMutation(
    {
      method: "put",
      url: `/member-view-api/dform/${dFormId}/user-value`,
      queryKey: MVADFormsQueryKeys.dFormValuesById(dFormId),
    },
    options
  );
};

// member-view-api/dform/5/new-version

export const useSubmitDFormForReviewMutation = ({ dFormId }, options) => {
  return useGenericMutation(
    {
      method: "post",
      url: `/member-view-api/dform/${dFormId}/new-version`,
      queryKey: MVADFormsQueryKeys.dFormById(dFormId),
    },
    options
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
      ...options,
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

// MVA Application Files

export const useCreateMVAUserFilesMutation = ({ dFormId, masterSchemaFieldId }, options = {}) => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    {
      method: "post",
      url: `member-view-api/dform/${dFormId}/user-files`,
    },
    {
      onSettled: (data, error, ...args) => {
        if (!error) {
          const files = data;
          const currentDFormValues = queryClient.getQueryData(MVADFormsQueryKeys.dFormValuesById(dFormId));
          currentDFormValues[masterSchemaFieldId] = { ...currentDFormValues[masterSchemaFieldId], files };

          queryClient.setQueriesData(MVADFormsQueryKeys.dFormValuesById(dFormId), currentDFormValues);
        }
        options.onSettled && options.onSettled(data, error, ...args);
      },
      ...options,
    }
  );
};

export const useDeleteMVAUserFileMutation = ({ dFormId, masterSchemaFieldId, fileId }, options = {}) => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    {
      method: "delete",
      url: `member-view-api/dform/${dFormId}/user-file`,
    },
    {
      onSettled: (data, error, ...args) => {
        if (!error) {
          const currentDFormValues = queryClient.getQueryData(MVADFormsQueryKeys.dFormValuesById(dFormId));

          currentDFormValues[masterSchemaFieldId] = {
            ...currentDFormValues[masterSchemaFieldId],
            files: currentDFormValues[masterSchemaFieldId].files.filter(({ file_id }) => file_id !== fileId),
          };

          queryClient.removeQueries(MVADFormsQueryKeys.file({ dFormId, masterSchemaFieldId, fileId }));
          queryClient.setQueriesData(MVADFormsQueryKeys.dFormValuesById(dFormId), currentDFormValues);
        }
        options.onSettled && options.onSettled(data, error, ...args);
      },
      ...options,
    }
  );
};

export const useMVAUserFileQuery = ({ dFormId, masterSchemaFieldId, fileId }, options) => {
  return useFileQuery(
    {
      url: `member-view-api/dform/${dFormId}/user-file-download?master_schema_field_id=${masterSchemaFieldId}&file_id=${fileId}`,
      queryKey: MVADFormsQueryKeys.file({ dFormId, masterSchemaFieldId, fileId }),
      shouldReadAsDataURL: false,
    },
    options
  );
};
