import "./styles.scss";

import React, { useState } from "react";

import NpmCard from "../../../nmp-ui/NpmCard";
import NpmSpin from "../../../nmp-ui/NpmSpin";
import MemberSurveyQuestion from "../MemberSurveyQuestion";
import MemberSurveyNavigations from "../MemberSurveyNavigations";

const MemberSurveyFeedbackView = ({ surveyInteraction, surveyStatus, setIsFeedbackView }) => {
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const { answers, questions } = surveyInteraction;
  const count = questions.length - 1;

  const handleSwitchToPreviousQuestion = () => {
    if (currQuestionIndex) {
      setCurrQuestionIndex(currQuestionIndex - 1);
    }
  };

  const handleAnswerSubmit = () => {
    if (currQuestionIndex < count) {
      setCurrQuestionIndex(currQuestionIndex + 1);
    } else {
      setIsFeedbackView(false);
    }
  };

  const handleClose = () => {
    setIsFeedbackView(false);
  };

  console.log("surveyInteraction", surveyInteraction);
  const currentQuestion = questions[currQuestionIndex]?.body ?? "";
  const currentAnswer = answers[currQuestionIndex]?.feedback ?? "";

  const structureType = questions[currQuestionIndex]?.answer_structure.type;
  const selectedAnswer = answers[currQuestionIndex]?.answer ?? "";
  const correctAnswer = questions[currQuestionIndex]?.correct_answer ?? null;
  const structureOptions = questions[currQuestionIndex].answer_structure.options;
  const points = questions[currQuestionIndex]?.answer_structure?.points ?? 0;

  const currentFeedback = answers[currQuestionIndex]?.feedback || `Question ${currQuestionIndex}`;

  if (!surveyInteraction) {
    return <NpmSpin size={60} />;
  }
  return (
    <div className="membercard-feedback">
      <div className="feedback-info">
        <NpmCard style={{ height: "76px", maxWidth: "783px", width: "57vw" }}>
          <div className="feedback-info_context">
            <div className="context-title">Feedback</div>
            <div className="context-subtitle">{currentFeedback}</div>
          </div>
        </NpmCard>
      </div>
      <NpmCard style={{ maxHeight: "500px", maxWidth: "783px", width: "57vw" }}>
        <div className="feedback-content">
          <div className="feedback-question">
            <div className="feedback-title">Question {currQuestionIndex + 1}</div>
            <div className="feedback-subtitle">{currentQuestion}</div>
          </div>
          <div className="feedback-answer">
            <MemberSurveyQuestion
              structureType={structureType}
              structureOptions={structureOptions}
              selectedAnswer={selectedAnswer}
              correctAnswer={correctAnswer}
            />
          </div>
          <div className="feedback-points">{points} points</div>
          <div className="feedback_buttons">
            <MemberSurveyNavigations
              surveyStatus={surveyStatus}
              handleSwitchToPreviousQuestion={handleSwitchToPreviousQuestion}
              handleAnswerSubmit={handleAnswerSubmit}
              currentIndex={currQuestionIndex}
              count={count}
              handleClose={handleClose}
            />
          </div>
        </div>
      </NpmCard>
    </div>
  );
};

export default MemberSurveyFeedbackView;