import { toast } from "react-toastify";

import React, { useState } from "react";

import { Col, Row } from "antd";

import {
  useGetCurrentQuestionForAssignedSurveyQuery,
  useSurveyByIdQuery,
  useGetAllSurveyQuestionsQuery,
  usePushAnswerMutation,
  useGetBeginSurveyQuery,
} from "api/Onboarding/prospectUserQuery";

import {
  useMVASurveyPassingInvalidate,
  // useMVApushAnswer,
  // useMVAgetBeginSurvey,
  useMVAswitchToPrevious,
} from "../../data/hooks";

import MemberCardPassSurveyView from "../MemberSurveyPassView";
import MemberThanksStatusView from "../MemberThanksStatusView";
import MemberSurveyReportView from "../MemberSurveyReportView";
import MemberSurveyFeedbackView from "../MemberSurveyFeedbackView";
import MemberSurveyStartView from "../MemberSurveyStartView";
import NpmSpin from "../../../nmp-ui/NpmSpin";

import { findStatusSurvey } from "../../data/helpers/findStatusSurvey";
import { Status } from "features/members/data/constants/statusConstants";

const MemberSurvey = ({ selectedSurveyId, isRecentlySubmitted, organization }) => {
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

  const { data: surveyInteraction } = useGetAllSurveyQuestionsQuery({ id }, { enabled: !!graded_at });
  const { isLoading: isAnswerPushProceed, mutate: mutatePushAnswer } = usePushAnswerMutation({ id });
  const { refetch } = useGetBeginSurveyQuery({ id }, { refetchOnWindowFocus: false, enabled: false });

  const {
    mutateSwitchToPreviousQuestion,
    previousQuestion,
    isLoadingPreviousQuestion,
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
    <Row justify="center" align="middle">
      <Col span={14}>
        {surveyStatus === Status.NOT_STARTED && (
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
        {surveyStatus === Status.STARTED && (
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
        {surveyStatus === Status.SUBMITTED && (
          <MemberThanksStatusView data={finished_at} organization={organization} surveyName={title} />
        )}
        {surveyStatus === Status.APPROVED && !isFeedbackView && (
          <MemberSurveyReportView
            data={graded_at}
            isSurveyPassed={isSurveyPassed}
            totalTime={totalTime}
            isShowResult={isShowResult}
            setIsFeedbackView={setIsFeedbackView}
          />
        )}
        {surveyStatus === Status.APPROVED && isFeedbackView && (
          <MemberSurveyFeedbackView
            surveyInteraction={surveyInteraction}
            surveyStatus={surveyStatus}
            setIsFeedbackView={setIsFeedbackView}
          />
        )}
      </Col>
    </Row>
    // </div>
  );
};

export default MemberSurvey;
