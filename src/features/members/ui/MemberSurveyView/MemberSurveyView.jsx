import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

import {
  useGetCurrentQuestionForAssignedSurveyQuery,
  useSurveyByIdQuery,
  useGetAllSurveyQuestionsQuery,
} from "api/Onboarding/prospectUserQuery";

import {
  useMVASurveyPassingInvalidate,
  useMVARecentSubmited,
  useMVApushAnswer,
  useMVAgetBeginSurvey,
  useMVAswitchToPrevious,
} from "../../data/hooks";

import MemberCardPassSurveyView from "../MemberSurveyPassView";
import MemberThanksStatusView from "../MemberThanksStatusView";
import MemberSurveyReportView from "../MemberSurveyReportView";
import MemberSurveyFeedbackView from "../MemberSurveyFeedbackView";
import MemberSurveyStartView from "../MemberSurveyStartView";
import NpmSpin from "../../../nmp-ui/NpmSpin";

// import OnboardingSurveyComponent from "./components/OnboardingSurveyComponent";
// import OnboardingSurveyFinishComponent from "./components/OnboardingSurveyFinishComponent";
// import TakingSurvey from "../../Surveys/Components/TakingSurvey";
// import StepperSurveyView from "./view/StepperSurveyView";
// import SurveyGradedView from "./view/SurveyGradedView";
// import SurveyFinishView from "./view/SurveyFinishView";
// import SurveyAdditionalInfoView from "./view/SurveyAdditionalInfoView";

import { findStatusSurvey } from "../../data/helpers/findStatusSurvey";
//import { getSurveySubmitStatus } from "./helpers/getSurveySubmitStatus";
import { StatusConstants } from "../../data/constants/statusConstants";

const MemberSurvey = ({
  selectedSurveyId,
  isAllApplicationsCompleted,
  isRecentlySubmitted,
  setRecentlySubmitted,
  organization,
}) => {
  const [answer, setAnswer] = useState("");
  const [isFeedbackView, setIsFeedbackView] = useState(false);

  const { data: survey, isLoading: isLoadingSurvey } = useSurveyByIdQuery(
    { id: selectedSurveyId },
    { enabled: !!selectedSurveyId }
  );

  const { id, started_at, finished_at, graded_at, title } = survey || {};

  const surveyStatus = findStatusSurvey(started_at, finished_at, graded_at, isRecentlySubmitted);

  let { data: currentQuestion, isLoading: isSurveyLoading } = useGetCurrentQuestionForAssignedSurveyQuery(
    { id },
    { enabled: [started_at, !finished_at].every(Boolean) }
  );

  const { data: surveyInteraction, isLoading: isSurveyGradedQuestionsLoading } = useGetAllSurveyQuestionsQuery(
    { id },
    { enabled: !!graded_at }
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

  //? deactivated recentSubmited status
  //useMVARecentSubmited(currentQuestion?.status, surveyStatus, setRecentlySubmitted);

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
  const currentQuestionAnswer = answers && !isNaN(currentIndex) ? answers[currentIndex] : null;

  const isSurveyPassed = survey && survey.stats?.total >= survey.stats?.min_percent_pass;
  const totalTime = survey?.stats?.totalTime ?? "00-00-00";
  const isFeedbackExist = !!survey?.passedSurveyData?.answers.find((answer) => !!answer.feedback);
  const isShowResult = survey?.is_show_result;
  const description = survey?.interaction_version?.description || "No description";

  if (!survey && isSurveyLoading && isLoadingSurvey) {
    return <NpmSpin size={60} />;
  }

  return (
    <>
      {surveyStatus === StatusConstants.NOT_STARTED && (
        <MemberSurveyStartView
          isLoadingData={isLoadingData}
          title={title}
          question={question}
          surveyStatus={surveyStatus}
          handleSurveyStart={handleSurveyStart}
          handleAnswerSelect={handleAnswerSelect}
          count={count}
          currentIndex={currentIndex}
          selectedAnswer={answer}
          currentQuestionAnswer={currentQuestionAnswer}
          handleSwitchToPreviousQuestion={handleSwitchToPreviousQuestion}
          handleAnswerSubmit={handleAnswerSubmit}
          description={description}
        />
      )}
      {surveyStatus === StatusConstants.STARTED && (
        <MemberCardPassSurveyView
          isLoadingData={isLoadingData}
          title={title}
          question={question}
          surveyStatus={surveyStatus}
          handleSurveyStart={handleSurveyStart}
          handleAnswerSelect={handleAnswerSelect}
          count={count}
          currentIndex={currentIndex}
          selectedAnswer={answer}
          currentQuestionAnswer={currentQuestionAnswer}
          handleSwitchToPreviousQuestion={handleSwitchToPreviousQuestion}
          handleAnswerSubmit={handleAnswerSubmit}
        />
      )}
      {surveyStatus === StatusConstants.SUBMITTED && (
        <MemberThanksStatusView data={finished_at} organization={organization} surveyName={title} />
      )}
      {surveyStatus === StatusConstants.APPROVED && !isFeedbackView && (
        <MemberSurveyReportView
          data={graded_at}
          isSurveyPassed={isSurveyPassed}
          totalTime={totalTime}
          isShowResult={isShowResult}
          setIsFeedbackView={setIsFeedbackView}
        />
      )}
      {surveyStatus === StatusConstants.APPROVED && isFeedbackView && (
        <MemberSurveyFeedbackView
          surveyInteraction={surveyInteraction}
          surveyStatus={surveyStatus}
          setIsFeedbackView={setIsFeedbackView}
        />
      )}
    </>
  );

  // return (
  //   <>
  //     {
  //       {
  //         [statusConstant.APPROVED]: (
  //           <SurveyGradedView
  //             survey={survey}
  //             surveyStatus={surveyStatus}
  //             setIsFeedbackView={setIsFeedbackView}
  //             isLoadingSurvey={isLoadingSurvey}
  //             isFeedbackView={isFeedbackView}
  //           />
  //         ),
  //         [statusConstant.SUBMITTED]: <SurveyFinishView />,
  //         [statusConstant.RECENT]: <SurveyFinishView />,
  //         [statusConstant.STARTED]: <StepperSurveyView />,
  //       }[surveyStatus]
  //     }
  //   </>
  // );

  // const [surveyFinishChild, Hello] = children;

  //return <TakingSurvey survey={survey} isRecentlySubmitted={isRecentlySubmitted} />;

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

export default MemberSurvey;
