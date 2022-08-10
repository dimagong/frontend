import { toast } from "react-toastify";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import {
  useGetCurrentQuestionForAssignedSurveyQuery,
  useSurveyByIdQuery,
  useGetBeginSurveyQuery,
  usePushAnswerMutation,
  MVASurveyPassingQueryKeys,
  useSwitchToPreviousQuestionMutation,
  useGetAllSurveyQuestionsQuery,
} from "api/Onboarding/prospectUserQuery";

import OnboardingSurveyComponent from "./components/OnboardingSurveyComponent";
import OnboardingSurveyStatusComponent from "./components/OnboardingSurveyStatusComponent";
import OnboardingSurveyFeedbackViewComponent from "./components/OnboardingSurveyFeedbackViewComponent";

//single responsibility  && interface segregation
const getSurveySubmitStatus = (survey, isSubmited) => {
  const status = (survey.graded_at && "approved") || (survey.finished_at && isSubmited && "recent") || "submitted";
  return status;
};

const OnboardingSurvey = ({ selectedSurvey, isAllApplicationsCompleted, isRecentlySubmitted }) => {
  const queryClient = useQueryClient();

  const [answer, setAnswer] = useState("");
  const [isFeedbackView, setIsFeedbackView] = useState(false);

  const { data: survey } = useSurveyByIdQuery({ id: selectedSurvey.id });
  const { id, started_at, finished_at, title, graded_at } = survey || {};

  const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";

  const submittedSurveyStatus = getSurveySubmitStatus(selectedSurvey, isRecentlySubmitted);

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

  //start survey
  if (isSurveyBeginProceed && surveyStatus === "notStarted") {
    queryClient.invalidateQueries(MVASurveyPassingQueryKeys.surveyById(id));
  }
  //finish survay
  if (currentQuestion?.status === "done" && surveyStatus === "started") {
    queryClient.invalidateQueries(MVASurveyPassingQueryKeys.surveyById(id));
  }

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

  const { data: surveyInteraction, isLoading: isSurveyGradedQuestionsLoading } = useGetAllSurveyQuestionsQuery(
    { id },
    { enabled: !!graded_at }
  );

  const isFeedbackExist = !!survey?.passedSurveyData?.answers.find((answer) => !!answer.feedback);

  const isLoadingData = (started_at && isSurveyLoading) || (started_at && !question) || isAnswerPushProceed;

  return finished_at ? (
    graded_at && isFeedbackView ? (
      <OnboardingSurveyFeedbackViewComponent
        questions={surveyInteraction.questions}
        answers={surveyInteraction.answers}
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
