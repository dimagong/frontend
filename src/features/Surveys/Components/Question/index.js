import React from "react";

import DesignerQuestion from "./Components/DesignerQuestion";
import ReviewQuestion from "./Components/ReviewQuestion";
import OnboardingQuestion from "./Components/OnboardingQuestion";
import GradingQuestion from "./Components/GradingQuestion";
import ReviewOnboardingQuestion from "./Components/ReviewOnboardingQuestion";

import "./styles.scss";

const Question = ({
  displayType,
  question,
  questionNumber,
  isSurveyDesigner,
  onEdit,
  onClick,
  isInSurvey,
  isSelected,
  handleRemoveQuestionFromSurvey,
  onAnswerChange,
  selectedAnswer,
  answer,
  onGradingAnswerSave,
  onFinishButtonDisableStateChange,
  isGradingReview,
  currAnswer,
  initAnswer,
  onFeedbackSubmit,
  isFeedbackSubmitProceeding,
}) => {
  const commonProps = {
    displayType,
    questionNumber,
    questionData: question,
  };

  return {
    "designer-view": (
      <DesignerQuestion
        {...commonProps}
        isSurveyDesigner={isSurveyDesigner}
        onEdit={onEdit}
        onClick={onClick}
        isInSurvey={isInSurvey}
        isSelected={isSelected}
        onRemove={handleRemoveQuestionFromSurvey}
      />
    ),
    review: <ReviewQuestion {...commonProps} currAnswer={currAnswer} />,
    "review-onboarding": <ReviewOnboardingQuestion {...commonProps} currAnswer={currAnswer} />,
    "review-prospect-onboarding": <ReviewQuestion {...commonProps} currAnswer={currAnswer} prospectView />,
    onboarding: (
      <OnboardingQuestion
        initAnswer={initAnswer}
        {...commonProps}
        onAnswerChange={onAnswerChange}
        answer={selectedAnswer}
      />
    ),
    grading: (
      <GradingQuestion
        {...commonProps}
        answer={answer}
        isFeedbackSubmitProceeding={isFeedbackSubmitProceeding}
        onGradingAnswerSave={onGradingAnswerSave}
        onFinishButtonDisableStateChange={onFinishButtonDisableStateChange}
        isGradingReview={isGradingReview}
        onFeedbackSubmit={onFeedbackSubmit}
      />
    ),
  }[displayType];
};

export default Question;
