import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import OnboardingSurveyComponent from "./components/OnboardingSurveyComponent";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectUserOnboarding } from "app/selectors/userSelectors";
import { toast } from "react-toastify";
import OnboardingSurveyStatusComponent from "./components/OnboardingSurveyStatusComponent";

import { appSlice } from "app/slices/appSlice";
import OnboardingSurveyFeedbackViewComponent from "./components/OnboardingSurveyFeedbackViewComponent";

import { useGetCurrentQuestionForAssignedSurvey, useGetBeginSurvey } from "api/Onboarding/prospectUserQuery";

const {
  getCurrentQuestionForAssignedSurveyRequest,
  beginSurveyRequest,
  pushAnswerRequest,
  switchToPreviousQuestionRequest,
  getAllSurveyQuestionsRequest,
} = appSlice.actions;

const OnboardingSurvey = ({ applicationData, isAllApplicationsCompleted, isRecentlySubmitted, appOnboarding }) => {
  const dispatch = useDispatch();
  const [answer, setAnswer] = useState("");
  const [isFeedbackView, setIsFeedbackView] = useState(false);

  //const isSurveyLoading = useSelector(createLoadingSelector([getCurrentQuestionForAssignedSurveyRequest.type]));
  const isAnswerPushProceed = useSelector(createLoadingSelector([pushAnswerRequest.type], true));
  const isSurveyBeginProceed = useSelector(createLoadingSelector([beginSurveyRequest.type], true));
  const isSurveySwitchToPreviousQuestionProceed = useSelector(
    createLoadingSelector([switchToPreviousQuestionRequest.type], true)
  );
  const isSurveyGradedQuestionsLoading = useSelector(createLoadingSelector([getAllSurveyQuestionsRequest.type], true));

  // const survey = useSelector(selectUserOnboarding);
  const survey = { ...appOnboarding };
  console.log("SURVEY appOnboarding", appOnboarding);

  const { question, count, answers, currentIndex } = survey;

  const { id, started_at, finished_at, title, graded_at } = applicationData;
  console.log("SURVEY applicationData", applicationData);

  const surveyStatus = (started_at && "started") || "notStarted";

  const submittedSurveyStatus =
    (applicationData.graded_at && "approved") ||
    (applicationData.finished_at && isRecentlySubmitted && "recent") ||
    "submitted";

  const { refetch, isSuccess: isSuccessCetBeginSurvay } = useGetBeginSurvey(
    { id },
    { refetchOnWindowFocus: false, enabled: false }
  );
  useGetCurrentQuestionForAssignedSurvey({ id }, { enabled: isSuccessCetBeginSurvay });
  const handleSurveyStart = () => {
    //dispatch(beginSurveyRequest(id));
    refetch();
  };

  const handleAnswerSelect = (answer) => {
    setAnswer(answer);
  };

  const handleSwitchToPreviousQuestion = () => {
    dispatch(switchToPreviousQuestionRequest(id));
  };

  const handleAnswerSubmit = () => {
    if (!answer || answer.trim() === "") {
      toast.error("Please, answer the question");
      return;
    }

    dispatch(
      pushAnswerRequest({
        surveyId: id,
        data: {
          question_id: question.id,
          answer,
        },
      })
    );

    setAnswer("");
  };

  const { isLoading: isSurveyLoading } = useGetCurrentQuestionForAssignedSurvey(
    { id },
    { enabled: [started_at, !finished_at].every(Boolean) }
  );
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
      currentQuestionAnswer={answers && currentIndex !== undefined && answers[currentIndex]}
      isLastQuestion={count - 1 === currentIndex}
      isFirstQuestion={currentIndex === 0}
      surveyDescription={survey?.interaction_version?.description || ""}
      onSwitchToPreviousQuestion={handleSwitchToPreviousQuestion}
      isSurveySwitchToPreviousQuestionProceed={isSurveySwitchToPreviousQuestionProceed}
      isAbleToSwitchToPreviousQuestion={survey?.options?.is_can_return}
    />
  );
};

export default OnboardingSurvey;
