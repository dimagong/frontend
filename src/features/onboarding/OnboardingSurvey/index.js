import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import {
  useGetCurrentQuestionForAssignedSurveyQuery,
  useSurveyByIdQuery,
  useGetBeginSurveyQuery,
  usePushAnswerMutation,
  MVASurveyPassingQueryKeys,
  useSwitchToPreviousQuestionMutation,
} from "api/Onboarding/prospectUserQuery";

import OnboardingSurveyComponent from "./components/OnboardingSurveyComponent";
import OnboardingSurveyFinishComponent from "./../OnboardingSurvey/components/OnboardingSurveyFinishComponent";

const useMVASurveyPassingInvalidate = (questionStatus, surveyStatus, id) => {
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

const useMVARecentSubmited = (questionStatus, surveyStatus, setRecentlySubmitted) => {
  useEffect(() => {
    if (questionStatus === "done" && surveyStatus === "started") {
      setRecentlySubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionStatus, surveyStatus]);
};

const OnboardingSurvey = ({
  selectedSurvey,
  isAllApplicationsCompleted,
  isRecentlySubmitted,
  setRecentlySubmitted,
}) => {
  const [answer, setAnswer] = useState("");
  const { data: survey } = useSurveyByIdQuery({ id: selectedSurvey.id });
  const { id, started_at, finished_at, title } = survey || {};

  const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";

  let { data: currentQuestion, isLoading: isSurveyLoading } = useGetCurrentQuestionForAssignedSurveyQuery(
    { id },
    { enabled: [started_at, !finished_at].every(Boolean) }
  );

  const {
    isSuccess: isPushAnswerSuccess,
    isLoading: isAnswerPushProceed,
    mutate: mutatePushAnswer,
  } = usePushAnswerMutation();

  let { data: currentQuestionPushAnswer, isLoading: isSurveyLoadingPushAnswer } =
    useGetCurrentQuestionForAssignedSurveyQuery({ id }, { enabled: isPushAnswerSuccess });

  if (isPushAnswerSuccess && currentQuestionPushAnswer) {
    currentQuestion = currentQuestionPushAnswer;
    isSurveyLoading = isSurveyLoadingPushAnswer;
  }

  const {
    refetch,
    isSuccess: isSuccessGetBeginSurvay,
    isLoading: isSurveyBeginProceed,
  } = useGetBeginSurveyQuery({ id }, { refetchOnWindowFocus: false, enabled: false });

  let { data: currentQuestionBegin, isLoading: isSurveyLoadingBegin } = useGetCurrentQuestionForAssignedSurveyQuery(
    { id },
    { enabled: isSuccessGetBeginSurvay }
  );

  if (currentQuestionBegin && isSuccessGetBeginSurvay) {
    currentQuestion = currentQuestionBegin;
    isSurveyLoading = isSurveyLoadingBegin;
  }

  let {
    isSuccess: isSuccessSwitchToPreviousQuestion,
    isLoading: isSurveySwitchToPreviousQuestionProceed,
    mutate: mutateSwitchToPreviousQuestion,
  } = useSwitchToPreviousQuestionMutation({ id });

  let { data: previousQuestion, isLoading: isLoadingPreviousQuestion } = useGetCurrentQuestionForAssignedSurveyQuery(
    { id },
    { enabled: isSuccessSwitchToPreviousQuestion }
  );

  if (previousQuestion && isSuccessSwitchToPreviousQuestion) {
    currentQuestion = previousQuestion;
    isSurveyLoading = isLoadingPreviousQuestion;
  }

  const { question, count, answers, currentIndex } = currentQuestion || {};

  useMVASurveyPassingInvalidate(currentQuestion?.status, surveyStatus, id);

  useMVARecentSubmited(currentQuestion?.status, surveyStatus, setRecentlySubmitted);

  const handleSurveyStart = () => {
    refetch();
  };

  const handleAnswerSelect = (answer) => {
    setAnswer(answer);
  };

  const handleSwitchToPreviousQuestion = () => {
    mutateSwitchToPreviousQuestion();
  };

  const handleAnswerSubmit = () => {
    if (!answer || answer.trim() === "") {
      toast.error("Please, answer the question");
      return;
    }

    mutatePushAnswer({
      surveyId: id,
      data: {
        question_id: question.id,
        answer,
      },
    });
    setAnswer("");
  };

  const isLoadingData = (started_at && isSurveyLoading) || (started_at && !question) || isAnswerPushProceed;

  return finished_at ? (
    <OnboardingSurveyFinishComponent
      survey={survey}
      isRecentlySubmitted={isRecentlySubmitted}
      isAllApplicationsCompleted={isAllApplicationsCompleted}
    />
  ) : (
    <OnboardingSurveyComponent
      onAnswerSubmit={handleAnswerSubmit}
      questionNumber={currentIndex + 1}
      progress={(currentIndex / count) * 100}
      question={question}
      isLoading={isLoadingData}
      onSurveyStart={handleSurveyStart}
      isSurveyBeginProceed={isSurveyBeginProceed}
      isAnswerPushProceed={isAnswerPushProceed}
      status={surveyStatus}
      surveyName={title}
      onAnswerChange={handleAnswerSelect}
      selectedAnswer={answer}
      currentQuestionAnswer={answers && currentIndex !== undefined && answers[currentIndex]}
      isLastQuestion={count - 1 === currentIndex}
      isFirstQuestion={currentIndex === 0}
      surveyDescription={survey?.interaction_version?.description || ""}
      onSwitchToPreviousQuestion={handleSwitchToPreviousQuestion}
      isSurveySwitchToPreviousQuestionProceed={isSurveySwitchToPreviousQuestionProceed}
      isAbleToSwitchToPreviousQuestion={survey?.interaction_version?.is_can_return}
    />
  );
};

export default OnboardingSurvey;
