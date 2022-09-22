import "./styles.scss";

import React, { useEffect } from "react";

import MemberSurveyNavigations from "../MemberSurveyNavigations";
import NpmSpin from "../../../nmp-ui/NpmSpin";
import NpmCard from "../../../nmp-ui/NpmCard";
import MemberSurveyAdditionalInfo from "../MemberSurveyAdditionalInfo";

const MemberSurveyStartView = (props) => {
  const {
    surveyStatus,
    handleSurveyStart,
    currentIndex,
    count,
    title,
    handleAnswerSelect,
    currentQuestionAnswer,
    handleSwitchToPreviousQuestion,
    handleAnswerSubmit,
    isLoadingData,
    description,
  } = props;

  useEffect(() => {
    if (currentQuestionAnswer) {
      handleAnswerSelect(currentQuestionAnswer.answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionAnswer]);

  if (isLoadingData) {
    return <NpmSpin size={60} />;
  }

  return (
    <div>
      <NpmCard title="Surveys" style={{ maxHeight: "580px", maxWidth: "783px", width: "57vw" }}>
        <div className="survey-start">
          <div className="content_question">
            <div className="question-title">{title}</div>
            <div className="question-subtitle">Click the button to get started.</div>
          </div>
          <div className="content_buttons">
            <MemberSurveyNavigations
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
      <div style={{ with: "100%", marginTop: "20px" }}>
        <MemberSurveyAdditionalInfo title={"Guidance"} text={description} />
      </div>
    </div>
  );
};

export default MemberSurveyStartView;
