import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "react-query";

import OnboardingSurveyComponent from "./components/OnboardingSurveyComponent";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectUserOnboarding } from "app/selectors/userSelectors";
import { toast } from "react-toastify";
import OnboardingSurveyStatusComponent from "./components/OnboardingSurveyStatusComponent";

import { appSlice } from "app/slices/appSlice";
import OnboardingSurveyFeedbackViewComponent from "./components/OnboardingSurveyFeedbackViewComponent";

import {
  useGetCurrentQuestionForAssignedSurvey,
  useSurveyByIdQuery,
  useGetBeginSurveyQuery,
  usePushAnswerMutation,
  ProspectUserProfileKeys,
  useSwitchToPreviousQuestionMutation,
} from "api/Onboarding/prospectUserQuery";

const {
  getCurrentQuestionForAssignedSurveyRequest,
  beginSurveyRequest,
  pushAnswerRequest,
  switchToPreviousQuestionRequest,
  getAllSurveyQuestionsRequest,
} = appSlice.actions;

const OnboardingSurvey = ({ selectedSurvey, isAllApplicationsCompleted, isRecentlySubmitted }) => {
  const queryClient = useQueryClient();
  //ProspectUserProfileKeys.surveyPassingById(id),
  const dispatch = useDispatch();
  const [answer, setAnswer] = useState("");
  const [isFeedbackView, setIsFeedbackView] = useState(false);

  //const isSurveyLoading = useSelector(createLoadingSelector([getCurrentQuestionForAssignedSurveyRequest.type]));

  // const isAnswerPushProceed = useSelector(createLoadingSelector([pushAnswerRequest.type], true));

  //const isSurveyBeginProceed = useSelector(createLoadingSelector([beginSurveyRequest.type], true));

  // const survey = useSelector(selectUserOnboarding);

  //================
  const isSurveySwitchToPreviousQuestionProceed = useSelector(
    createLoadingSelector([switchToPreviousQuestionRequest.type], true)
  );

  const isSurveyGradedQuestionsLoading = useSelector(createLoadingSelector([getAllSurveyQuestionsRequest.type], true));
  //=================

  const { data: survey } = useSurveyByIdQuery({ id: selectedSurvey.id });
  const { id, started_at, finished_at, title, graded_at } = survey || {};

  const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";

  const submittedSurveyStatus =
    (selectedSurvey.graded_at && "approved") ||
    (selectedSurvey.finished_at && isRecentlySubmitted && "recent") ||
    "submitted";

  let { data: currentQuestion, isLoading: isSurveyLoading } = useGetCurrentQuestionForAssignedSurvey(
    { id },
    { enabled: [started_at, !finished_at].every(Boolean) }
  );

  const {
    isSuccess: isPushAnswerSuccess,
    isLoading: isAnswerPushProceed,
    mutate: mutatePushAnswer,
  } = usePushAnswerMutation();

  let { data: currentQuestionPushAnswer, isLoading: isSurveyLoadingPushAnswer } =
    useGetCurrentQuestionForAssignedSurvey({ id }, { enabled: isPushAnswerSuccess });

  if (isPushAnswerSuccess && currentQuestionPushAnswer) {
    currentQuestion = currentQuestionPushAnswer;
    isSurveyLoading = isSurveyLoadingPushAnswer;
  }

  const {
    refetch,
    isSuccess: isSuccessGetBeginSurvay,
    isLoading: isSurveyBeginProceed,
  } = useGetBeginSurveyQuery({ id }, { refetchOnWindowFocus: false, enabled: false });

  let { data: currentQuestionBegin, isLoading: isSurveyLoadingBegin } = useGetCurrentQuestionForAssignedSurvey(
    { id },
    { enabled: isSuccessGetBeginSurvay }
  );

  if (currentQuestionBegin && isSurveyLoadingBegin) {
    currentQuestion = currentQuestionBegin;
    isSurveyLoading = isSurveyLoadingBegin;
  }

  const {
    data: previousQuestion,
    isLoading: isSwitchToPreviousQuestionLoading,
    mutate: mutateSwitchToPreviousQuestion,
  } = useSwitchToPreviousQuestionMutation({ id });

  if (previousQuestion && isSwitchToPreviousQuestionLoading) {
    currentQuestion = previousQuestion;
    isSurveyLoading = isSwitchToPreviousQuestionLoading;
  }

  const { question, count, answers, currentIndex } = currentQuestion || {};

  if (isSurveyBeginProceed && surveyStatus === "notStarted") {
    queryClient.invalidateQueries(ProspectUserProfileKeys.surveyPassingById(id));
  }
  if (currentQuestion?.status === "done" && surveyStatus === "started") {
    queryClient.invalidateQueries(ProspectUserProfileKeys.surveyPassingById(id));
  }

  const handleSurveyStart = () => {
    //dispatch(beginSurveyRequest(id));
    refetch();
  };

  const handleAnswerSelect = (answer) => {
    setAnswer(answer);
  };

  const handleSwitchToPreviousQuestion = () => {
    mutateSwitchToPreviousQuestion();
    //dispatch(switchToPreviousQuestionRequest(id));
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

    // dispatch(
    //   pushAnswerRequest({
    //     surveyId: id,
    //     data: {
    //       question_id: question.id,
    //       answer,
    //     },
    //   })
    // );

    setAnswer("");
  };

  // useEffect(() => {
  //   if (started_at && !finished_at) {
  //     dispatch(getCurrentQuestionForAssignedSurveyRequest(id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (graded_at) {
      dispatch(getAllSurveyQuestionsRequest(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFeedbackExist = !!survey?.passedSurveyData?.answers.find((answer) => !!answer.feedback);

  const isLoadingData = (started_at && isSurveyLoading) || (started_at && !question) || isAnswerPushProceed;

  console.log("currentQuestion", currentQuestion);
  console.log("survey", survey);

  return finished_at ? (
    graded_at && isFeedbackView ? (
      <OnboardingSurveyFeedbackViewComponent
        questions={survey.passedSurveyData.questions}
        answers={survey.passedSurveyData.answers}
        onFeedbackClose={() => setIsFeedbackView(false)}
        showResult={survey.is_show_result}
      />
    ) : (
      <div style={{ marginLeft: "-100px", marginRight: "100px" }}>
        <OnboardingSurveyStatusComponent
          survey={survey}
          isFeedbackExist={isFeedbackExist}
          isLoading={isSurveyGradedQuestionsLoading}
          onForceApplicationShow={setIsFeedbackView}
          status={submittedSurveyStatus}
          isAllApplicationsCompleted={isAllApplicationsCompleted}
        />
      </div>
    )
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
      //startedAt={started_at}
      surveyName={title}
      //finishedAt={finished_at}
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
