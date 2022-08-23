import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import { useGetAllSurveyQuestionsQuery } from "api/Onboarding/prospectUserQuery";

import OnboardingSurveyFeedbackViewComponent from "./../OnboardingSurveyFeedbackViewComponent";
import OnboardingSurveyStatusComponent from "./../OnboardingSurveyStatusComponent";

import SurveyAdditionalInfoComponent from "../../view/SurveyAdditionalInfoView";

import Question from "./../../../../Surveys/Components/Question";
import SurveyFeedbackNavigation from "./../OnboardingSurveyComponent/components/SurveyFeedbackNavigation";

import SurveyStatusTopbar from "./../OnboardingSurveyStatusComponent/components/SurveyStatusTopbar";
import SurveyStatusSection from "./../OnboardingSurveyStatusComponent/components/SurveyStatusSection";
import MessagesSurveyStatus from "./../OnboardingSurveyStatusComponent/components/MessagesSurveyStatus";
import ButtonSurveyStatus from "./../OnboardingSurveyStatusComponent/components/ButtonSurveyStatus";

import appSlice from "app/slices/appSlice";
const { getSurveyByIdRequest } = appSlice.actions;

const getSurveySubmitStatus = (survey, isSubmited) => {
  const status = (survey.graded_at && "approved") || (survey.finished_at && isSubmited && "recent") || "submitted";
  return status;
};

const OnboardingSurveyFinishComponent = ({
  survey,
  isLoadingSurvey,
  isRecentlySubmitted,
  isAllApplicationsCompleted,
}) => {
  const [isFeedbackView, setIsFeedbackView] = useState(false);
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);

  const { id, graded_at, is_show_result } = survey;
  console.log("survey", survey);

  const { data: surveyInteraction, isLoading: isSurveyGradedQuestionsLoading } = useGetAllSurveyQuestionsQuery(
    { id },
    { enabled: !!graded_at }
  );

  console.log("surveyInteraction", surveyInteraction);
  const isFeedbackExist = !!survey?.passedSurveyData?.answers.find((answer) => !!answer.feedback);
  console.log("isFeedbackExist", isFeedbackExist);

  const submittedSurveyStatus = getSurveySubmitStatus(survey, isRecentlySubmitted);

  //

  const { questions, answers } = surveyInteraction ?? {};
  const numberedQuestions = questions
    ? questions.map((question, index) => ({ ...question, questionNumber: index + 1 }))
    : [];

  const questionsToShow = answers
    ? answers.map((answer, index) => {
        if (is_show_result || answer.feedback) {
          return {
            question: numberedQuestions[index],
            answer: answer,
          };
        }
      })
    : [];

  // eslint-disable-next-line array-callback-return
  // answers?.length &&
  //   answers.map((answer, index) => {
  //     if (is_show_result || answer.feedback) {
  //       questionsToShow.push({
  //         question: numberedQuestions[index],
  //         answer: answer,
  //       });
  //     }
  //   });

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

  const additionalText = questionsToShow[currQuestionIndex]?.answer?.feedback;
  const currAnswer = is_show_result
    ? questionsToShow[currQuestionIndex]?.answer
    : questionsToShow[currQuestionIndex]?.answer;
  const questionNumber = questionsToShow[currQuestionIndex]?.question.questionNumber;
  const questionCurrent = questionsToShow[currQuestionIndex]?.question;
  const displayType = is_show_result ? "review-prospect-onboarding" : "review-onboarding";

  const isSurveyPassed = survey && survey.total >= survey.min_percent_pass;

  const isSurveyStatsLoading = useSelector(createLoadingSelector([getSurveyByIdRequest.type]));

  return graded_at && isFeedbackView ? (
    <OnboardingSurveyFeedbackViewComponent>
      <SurveyAdditionalInfoComponent
        className="onboarding-survey-manager_feedback"
        label={"Feedback"}
        text={additionalText}
      />
      <Question
        currAnswer={currAnswer}
        questionNumber={questionNumber}
        question={questionCurrent}
        displayType={displayType}
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
        // isAllApplicationsCompleted={isAllApplicationsCompleted}
      >
        <SurveyStatusTopbar time={survey.graded_at} />
        <SurveyStatusSection
          // isSurveyStatsLoading={isSurveyStatsLoading}
          isSurveyStatsLoading={isLoadingSurvey}
          isSurveyPassed={isSurveyPassed}
          surveyStats={survey.stats}
        />
        <ButtonSurveyStatus onForceApplicationShow={setIsFeedbackView}>View feedback</ButtonSurveyStatus>
        {/* <MessagesSurveyStatus
          status={submittedSurveyStatus}
          isAllApplicationsCompleted={isAllApplicationsCompleted}
          isFeedbackExist={isFeedbackExist}
          is_show_result={survey.is_show_result}
        >
          <ButtonSurveyStatus onForceApplicationShow={setIsFeedbackView}>View feedback</ButtonSurveyStatus>
        </MessagesSurveyStatus> */}
      </OnboardingSurveyStatusComponent>
    </div>
  );
};

export default OnboardingSurveyFinishComponent;
