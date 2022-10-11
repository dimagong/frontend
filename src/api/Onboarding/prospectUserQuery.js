import { useDispatch } from "react-redux";
import { useMutation } from "react-query";

import { clientAPI } from "api/clientAPI";
import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useGenericMutation } from "api/useGenericMutation";

import appSlice from "app/slices/appSlice";
import { useFileQuery } from "../file/useFileQueries";
import { toast } from "react-toastify";

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
      // Temporary changed from "/member-view-api" to "api"
      // url: `/member-view-api/user/profile`,
      url: `/api/user/profile`,
      queryKey: MVAProfileQueryKeys.all(),
    },
    {
      onError: (error) => dispatch(getProfileError(error.message)),
      ...options,
    }
  );
};

// MVA DForm's Queries/Mutations

const MVADFormQueryKey = createQueryKey("MVA DForm");

export const MVADFormQueryKeys = {
  all: () => [MVADFormQueryKey],
  byId: (dFormId) => [...MVADFormQueryKeys.all(), { dFormId }],
  valuesById: (dFormId) => [...MVADFormQueryKeys.byId(dFormId), "values"],

  files: ({ dFormId, masterSchemaFieldId }) => [
    ...MVADFormQueryKeys.valuesById(dFormId),
    { masterSchemaFieldId },
    "files",
  ],
  file: ({ dFormId, masterSchemaFieldId, fileId }) => [
    ...MVADFormQueryKeys.files({ dFormId, masterSchemaFieldId }),
    { fileId },
  ],
};

export const useMVADFormsQuery = (options) => {
  return useGenericQuery(
    {
      url: `/member-view-api/dform`,
      queryKey: MVADFormQueryKeys.all(),
    },
    options
  );
};

export const useDFormQuery = ({ dformId }, options) => {
  return useGenericQuery(
    {
      url: `/member-view-api/dform/${dformId}`,
      queryKey: MVADFormQueryKeys.byId(dformId),
    },
    options
  );
};

export const useDFormValuesQuery = ({ dformId }, options) => {
  return useGenericQuery(
    {
      url: `/member-view-api/dform/${dformId}/user-values`,
      queryKey: MVADFormQueryKeys.valuesById(dformId),
    },
    options
  );
};

export const useSaveDFormFieldValueMutation = ({ dformId }, options = {}) => {
  return useGenericMutation(
    {
      method: "put",
      url: `/member-view-api/dform/${dformId}/user-value`,
    },
    {
      // onError: () => void toast.error("Last changes in field doesn't saved"),
      ...options,
    }
  );
};

export const useSubmitDFormMutation = ({ dformId }, options) => {
  return useGenericMutation(
    {
      method: "post",
      url: `/member-view-api/dform/${dformId}/new-version`,
      queryKey: MVADFormQueryKeys.all(dformId),
    },
    options
  );
};

// MVA DForm Categories' Queries/Mutations

const MVADFormCategoryQueryKey = createQueryKey("MVA DForm category");

export const MVADFormCategoryQueryKeys = {
  all: () => [MVADFormCategoryQueryKey],
};

export const useMVADFormsCategoriesQuery = (options) => {
  return useGenericQuery(
    {
      url: `/member-view-api/dform/category`,
      queryKey: MVADFormCategoryQueryKeys.all(),
    },
    options
  );
};

// MVA Survey's Queries/Mutations

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

export const useCreateMVAUserFilesMutation = ({ dFormId }, options = {}) => {
  return useGenericMutation({ method: "post", url: `member-view-api/dform/${dFormId}/user-files` }, options);
};

export const useDeleteMVAUserFileMutation = ({ dFormId, fileId }, options) => {
  return useGenericMutation({ method: "delete", url: `member-view-api/dform/${dFormId}/user-file` }, options);
};

export const useMVAUserFileQuery = ({ dFormId, masterSchemaFieldId, fileId }, options) => {
  return useFileQuery(
    {
      url: `member-view-api/dform/${dFormId}/user-file-download?master_schema_field_id=${masterSchemaFieldId}&file_id=${fileId}`,
      queryKey: MVADFormQueryKeys.file({ dFormId, masterSchemaFieldId, fileId }),
      shouldReadAsDataURL: false,
    },
    options
  );
};
