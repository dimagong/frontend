import React, { useState } from "react";

import { useGetAllSurveyQuestionsQuery, useSurveyByIdQuery } from "api/Onboarding/prospectUserQuery";

import OnboardingSurveyFeedbackViewComponent from "./../OnboardingSurveyFeedbackViewComponent";
import OnboardingSurveyStatusComponent from "./../OnboardingSurveyStatusComponent";

import SurveyAdditionalInfoComponent from "./../OnboardingSurveyComponent/components/SurveyAdditionalInfoComponent";

import Question from "./../../../../Surveys/Components/Question";
import SurveyFeedbackNavigation from "./../OnboardingSurveyComponent/components/SurveyFeedbackNavigation";

const getSurveySubmitStatus = (survey, isSubmited) => {
  const status = (survey.graded_at && "approved") || (survey.finished_at && isSubmited && "recent") || "submitted";
  return status;
};

const OnboardingSurveyFinishComponent = ({ survey, isRecentlySubmitted, isAllApplicationsCompleted }) => {
  const [isFeedbackView, setIsFeedbackView] = useState(false);
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);

  //const { data: survey } = useSurveyByIdQuery({ id: selectedSurveyId });

  const { id, graded_at, is_show_result } = survey;

  const { data: surveyInteraction, isLoading: isSurveyGradedQuestionsLoading } = useGetAllSurveyQuestionsQuery(
    { id },
    { enabled: !!graded_at }
  );

  const isFeedbackExist = !!survey?.passedSurveyData?.answers.find((answer) => !!answer.feedback);

  const submittedSurveyStatus = getSurveySubmitStatus(survey, isRecentlySubmitted);

  //

  const { questions, answers } = surveyInteraction ?? {};
  const numberedQuestions = questions
    ? questions.map((question, index) => ({ ...question, questionNumber: index + 1 }))
    : [];

  const questionsToShow = [];

  // eslint-disable-next-line array-callback-return
  answers?.length &&
    answers.map((answer, index) => {
      if (is_show_result || answer.feedback) {
        questionsToShow.push({
          question: numberedQuestions[index],
          answer: answer,
        });
      }
    });

  const handleSwitchToNextQuestion = () => {
    if (questionsToShow.length - 1 >= currQuestionIndex + 1) {
      setCurrQuestionIndex(currQuestionIndex + 1);
    }
  };

  const handleSwitchToPrevQuestion = () => {
    if (currQuestionIndex !== 0) {
      setCurrQuestionIndex(currQuestionIndex - 1);
    }
  };

  return graded_at && isFeedbackView ? (
    <OnboardingSurveyFeedbackViewComponent>
      <SurveyAdditionalInfoComponent
        className="onboarding-survey-manager_feedback"
        label={"Feedback"}
        text={questionsToShow[currQuestionIndex].answer.feedback}
      />
      <Question
        currAnswer={
          is_show_result ? questionsToShow[currQuestionIndex].answer : questionsToShow[currQuestionIndex].answer
        }
        questionNumber={questionsToShow[currQuestionIndex].question.questionNumber}
        question={questionsToShow[currQuestionIndex].question}
        displayType={is_show_result ? "review-prospect-onboarding" : "review-onboarding"}
      />
      <SurveyFeedbackNavigation
        onFeedbackClose={() => setIsFeedbackView(false)}
        questionsToShow={questionsToShow}
        currQuestionIndex={currQuestionIndex}
        handleSwitchToPrevQuestion={handleSwitchToPrevQuestion}
        handleSwitchToNextQuestion={handleSwitchToNextQuestion}
      />
    </OnboardingSurveyFeedbackViewComponent>
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
  );
};

export default OnboardingSurveyFinishComponent;
