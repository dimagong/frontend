import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from "react-redux";

import OnboardingSurveyComponent from "./components/OnboardingSurveyComponent";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectUserOnboarding } from "app/selectors/userSelectors";
import { toast } from "react-toastify";

import { appSlice } from "app/slices/appSlice";

const {
  getCurrentQuestionForAssignedSurveyRequest,
  beginSurveyRequest,
  pushAnswerRequest,
} = appSlice.actions;

const OnboardingSurvey = ({ applicationData }) => {
  const dispatch = useDispatch();
  const [answer, setAnswer] = useState("");

  const isSurveyLoading = useSelector(createLoadingSelector([getCurrentQuestionForAssignedSurveyRequest.type]));
  const isAnswerPushProceed = useSelector(createLoadingSelector([pushAnswerRequest.type], true));
  const isSurveyBeginProceed = useSelector(createLoadingSelector([beginSurveyRequest.type], true));

  const survey = useSelector(selectUserOnboarding);

  const {
    question,
    count,
    currentIndex,
  } = survey;

  const {
    id,
    started_at,
    finished_at,
    title,
  } = applicationData;

  const surveyStatus = (started_at && "started") || "notStarted";

  const handleSurveyStart = () => {
    dispatch(beginSurveyRequest(id))
  };

  const handleAnswerSelect = (answer) => {
    setAnswer(answer)
  };

  const handleAnswerSubmit = () => {

    if (answer.trim() === "") {
      toast.error("Please, answer the question");
      return;
    }

    dispatch(pushAnswerRequest({
      surveyId: id,
      data: {
        question_id: question.id,
        answer,
      }
    }));

    setAnswer("")
  };

  useEffect(() => {
    if (started_at && !finished_at) {
      dispatch(getCurrentQuestionForAssignedSurveyRequest(id))
    }
  }, []);

  return (
    <OnboardingSurveyComponent
      onAnswerSubmit={handleAnswerSubmit}
      questionNumber={currentIndex + 1}
      progress={currentIndex / count * 100}
      question={question}
      isLoading={(started_at && isSurveyLoading) || (started_at && !question) || isAnswerPushProceed}
      onSurveyStart={handleSurveyStart}
      isSurveyBeginProceed={isSurveyBeginProceed}
      isAnswerPushProceed={isAnswerPushProceed}
      status={surveyStatus}
      startedAt={started_at}
      surveyName={title}
      finishedAt={finished_at}
      onAnswerChange={handleAnswerSelect}
      selectedAnswer={answer}
      isLastQuestion={(count - 1) === currentIndex}
      surveyDescription={survey.interaction_version.description}
    />
  )
};

export default OnboardingSurvey;
