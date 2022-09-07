import { useEffect } from "react";
import { useQueryClient } from "react-query";

import {
  useGetCurrentQuestionForAssignedSurveyQuery,
  useGetBeginSurveyQuery,
  usePushAnswerMutation,
  MVASurveyPassingQueryKeys,
  useSwitchToPreviousQuestionMutation,
} from "api/Onboarding/prospectUserQuery";

export const useMVASurveyPassingInvalidate = (questionStatus, surveyStatus, id) => {
  const queryClient = useQueryClient();
  //start survey isSurveyBeginProceed
  if (questionStatus === "in-progress" && surveyStatus === "notStarted") {
    queryClient.invalidateQueries(MVASurveyPassingQueryKeys.surveyById(id));
  }
  //finish survay
  if (questionStatus === "done" && surveyStatus === "started") {
    queryClient.invalidateQueries(MVASurveyPassingQueryKeys.surveyById(id));
  }
};

export const useMVARecentSubmited = (questionStatus, surveyStatus, setRecentlySubmitted) => {
  useEffect(() => {
    if (questionStatus === "done" && surveyStatus === "started") {
      setRecentlySubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionStatus, surveyStatus]);
};

export const useMVApushAnswer = (id) => {
  const {
    isSuccess: isPushAnswerSuccess,
    isLoading: isAnswerPushProceed,
    mutate: mutatePushAnswer,
  } = usePushAnswerMutation();

  let { data: currentQuestionPushAnswer, isLoading: isSurveyLoadingPushAnswer } =
    useGetCurrentQuestionForAssignedSurveyQuery({ id }, { enabled: isPushAnswerSuccess });

  return { mutatePushAnswer, currentQuestionPushAnswer, isSurveyLoadingPushAnswer, isAnswerPushProceed };
};

export const useMVAgetBeginSurvey = (id) => {
  const {
    refetch,
    isSuccess: isSuccessGetBeginSurvay,
    isLoading: isSurveyBeginProceed,
  } = useGetBeginSurveyQuery({ id }, { refetchOnWindowFocus: false, enabled: false });

  let { data: currentQuestionBegin, isLoading: isSurveyLoadingBegin } = useGetCurrentQuestionForAssignedSurveyQuery(
    { id },
    { enabled: isSuccessGetBeginSurvay }
  );

  return { refetch, currentQuestionBegin, isSurveyLoadingBegin, isSurveyBeginProceed, isSuccessGetBeginSurvay };
};

export const useMVAswitchToPrevious = (id) => {
  let {
    isSuccess: isSuccessSwitchToPreviousQuestion,
    isLoading: isSurveySwitchToPreviousQuestionProceed,
    mutate: mutateSwitchToPreviousQuestion,
  } = useSwitchToPreviousQuestionMutation({ id });

  let { data: previousQuestion, isLoading: isLoadingPreviousQuestion } = useGetCurrentQuestionForAssignedSurveyQuery(
    { id },
    { enabled: isSuccessSwitchToPreviousQuestion }
  );

  return {
    mutateSwitchToPreviousQuestion,
    previousQuestion,
    isLoadingPreviousQuestion,
    isSurveySwitchToPreviousQuestionProceed,
    isSuccessSwitchToPreviousQuestion,
  };
};
