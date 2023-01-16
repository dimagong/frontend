import { toast } from "react-toastify";

import { useMutation, useQueryClient } from "react-query";

import appSlice from "app/slices/appSlice";

import { useDispatch } from "react-redux";

import { clientAPI } from "api/clientAPI";

const { gradeSurveyQuestionAnswerSuccess, gradeSurveyQuestionAnswerError } = appSlice.actions;

const GradeSurveyQuestionAnswerKey = "gradeSurveyQuestionAnswer";

const GradeSurveyQuestionAnswerKeys = {
  all: () => [GradeSurveyQuestionAnswerKey],
  byId: (surveyId) => [...GradeSurveyQuestionAnswerKeys.all(), { surveyId }],
};

export const useGradeSurveyQuestionMutation = ({ surveyId }, options = {}) => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => clientAPI["put"](`api/survey-assigned-interaction/${surveyId}/update-grade`, data),
    onSuccess: (response) => {
      toast.success("The grade has been changed");
      dispatch(gradeSurveyQuestionAnswerSuccess(response));
      queryClient.invalidateQueries(GradeSurveyQuestionAnswerKeys.byId(surveyId));
    },
    onError: (error) => {
      toast.success("Oops! Something went wrong!");
      dispatch(gradeSurveyQuestionAnswerError(error.message));
    },
    ...options,
  });
};
