import { toast } from "react-toastify";
import React, { useState } from "react";

import { useGetCurrentQuestionForAssignedSurveyQuery, useSurveyByIdQuery } from "api/Onboarding/prospectUserQuery";

import {
  useMVASurveyPassingInvalidate,
  useMVARecentSubmited,
  useMVApushAnswer,
  useMVAgetBeginSurvey,
  useMVAswitchToPrevious,
} from "./hooks";

import OnboardingSurveyComponent from "./components/OnboardingSurveyComponent";
import OnboardingSurveyFinishComponent from "./../OnboardingSurvey/components/OnboardingSurveyFinishComponent";
import TakingSurvey from "../../Surveys/Components/TakingSurvey";

const OnboardingSurvey = ({
  survey,
  isAllApplicationsCompleted,
  isRecentlySubmitted,
  setRecentlySubmitted,
  isLoadingSurvey,
}) => {
  const [answer, setAnswer] = useState("");

  const { id, started_at, finished_at, title } = survey || {};

  const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";

  let { data: currentQuestion, isLoading: isSurveyLoading } = useGetCurrentQuestionForAssignedSurveyQuery(
    { id },
    { enabled: [started_at, !finished_at].every(Boolean) }
  );

  const {
    mutatePushAnswer,
    currentQuestionPushAnswer,
    isSurveyLoadingPushAnswer,
    isAnswerPushProceed,
    isPushAnswerSuccess,
  } = useMVApushAnswer(id);

  if (isPushAnswerSuccess && currentQuestionPushAnswer) {
    [currentQuestion, isSurveyLoading] = [currentQuestionPushAnswer, isSurveyLoadingPushAnswer];
  }

  const { refetch, currentQuestionBegin, isSurveyLoadingBegin, isSurveyBeginProceed, isSuccessGetBeginSurvay } =
    useMVAgetBeginSurvey(id);

  if (currentQuestionBegin && isSuccessGetBeginSurvay) {
    [currentQuestion, isSurveyLoading] = [currentQuestionBegin, isSurveyLoadingBegin];
  }

  const {
    mutateSwitchToPreviousQuestion,
    previousQuestion,
    isLoadingPreviousQuestion,
    isSurveySwitchToPreviousQuestionProceed,
    isSuccessSwitchToPreviousQuestion,
  } = useMVAswitchToPrevious(id);
  if (previousQuestion && isSuccessSwitchToPreviousQuestion) {
    [currentQuestion, isSurveyLoading] = [previousQuestion, isLoadingPreviousQuestion];
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
  const currentQuestionAnswer = answers && currentIndex ? answers[currentIndex] : null;

  // const [surveyFinishChild, Hello] = children;

  return <TakingSurvey survey={survey} isRecentlySubmitted={isRecentlySubmitted} />;
  // return finished_at ? (
  //   <OnboardingSurveyFinishComponent
  //     survey={survey}
  //     isRecentlySubmitted={isRecentlySubmitted}
  //     isAllApplicationsCompleted={!isAllApplicationsCompleted.length}
  //     isLoadingSurvey={isLoadingSurvey}
  //   />
  // ) : (
  //   <OnboardingSurveyComponent
  //     onAnswerSubmit={handleAnswerSubmit}
  //     questionNumber={currentIndex + 1}
  //     progress={(currentIndex / count) * 100}
  //     question={question}
  //     isLoading={isLoadingData}
  //     onSurveyStart={handleSurveyStart}
  //     isSurveyBeginProceed={isSurveyBeginProceed}
  //     isAnswerPushProceed={isAnswerPushProceed}
  //     status={surveyStatus}
  //     surveyName={title}
  //     onAnswerChange={handleAnswerSelect}
  //     selectedAnswer={answer}
  //     currentQuestionAnswer={currentQuestionAnswer}
  //     isLastQuestion={count - 1 === currentIndex}
  //     isFirstQuestion={currentIndex === 0}
  //     surveyDescription={survey?.interaction_version?.description || ""}
  //     onSwitchToPreviousQuestion={handleSwitchToPreviousQuestion}
  //     isSurveySwitchToPreviousQuestionProceed={isSurveySwitchToPreviousQuestionProceed}
  //     isAbleToSwitchToPreviousQuestion={survey?.interaction_version?.is_can_return}
  //   />
  // );
};

export default OnboardingSurvey;
