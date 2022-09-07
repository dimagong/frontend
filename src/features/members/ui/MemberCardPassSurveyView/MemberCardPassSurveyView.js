import "./styles.scss";

import React, { useEffect } from "react";

import { statusConstants } from "../../data/constants/statusConstants";

import MemberQuestion from "../MemberQuestion";
import MemberCardNavigations from "../MemberCardNavigations";
import NpmSpin from "../../../nmp-ui/NpmSpin";
import NpmCard from "../../../nmp-ui/NpmCard";
import NpmStepper from "../../../nmp-ui/NpmStepper";

const MemberCardPassSurveyView = (props) => {
  const {
    surveyStatus,
    handleSurveyStart,
    currentIndex,
    count,
    title,
    question,
    handleAnswerSelect,
    selectedAnswer,
    currentQuestionAnswer,
    handleSwitchToPreviousQuestion,
    handleAnswerSubmit,
    isLoadingData,
  } = props;

  useEffect(() => {
    console.log(" EEEEffect currentQuestionAnswer", currentQuestionAnswer);
    if (currentQuestionAnswer) {
      handleAnswerSelect(currentQuestionAnswer.answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionAnswer]);

  const structureType = question?.answer_structure?.type;
  const structureOptions = question?.answer_structure?.options;
  const hint = question?.hint || "some hint";

  if (isLoadingData) {
    return <NpmSpin size={60} />;
  }

  return (
    <NpmCard title="Surveys" style={{ maxHeight: "580px", maxWidth: "783px", width: "57vw" }}>
      <div className="surveys-content">
        <div className="content_stepper">
          <NpmStepper currentStrep={currentIndex + 1} totalSteps={count} />
        </div>

        <div className="content_question">
          <div className="question-title">{question && `Question ${currentIndex + 1}`}</div>
          <div className="question-subtitle">{question?.body}</div>
        </div>
        <div className="content_answer">
          <MemberQuestion
            structureType={structureType}
            structureOptions={structureOptions}
            handleAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            hint={hint}
          />
        </div>
        <div className="content_buttons">
          <MemberCardNavigations
            surveyStatus={surveyStatus}
            handleSurveyStart={handleSurveyStart}
            handleSwitchToPreviousQuestion={handleSwitchToPreviousQuestion}
            handleAnswerSubmit={handleAnswerSubmit}
            currentIndex={currentIndex}
            count={count}
          />
        </div>
      </div>
    </NpmCard>
  );
};

export default MemberCardPassSurveyView;
