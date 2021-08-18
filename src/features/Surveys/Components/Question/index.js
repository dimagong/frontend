import React from 'react';

import DesignerQuestion from "./Components/DesignerQuestion";
import ReviewQuestion from "./Components/ReviewQuestion";
import OnboardingQuestion from './Components/OnboardingQuestion';
import GradingQuestion from "./Components/GradingQuestion";

import './styles.scss'

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
  currAnswer
}) => {

  const commonProps = {
    displayType,
    questionNumber,
    questionData: question,
  };

  return {
    "designer-view": <DesignerQuestion
                  {...commonProps}
                  isSurveyDesigner={isSurveyDesigner}
                  onEdit={onEdit}
                  onClick={onClick}
                  isInSurvey={isInSurvey}
                  isSelected={isSelected}
                  onRemove={handleRemoveQuestionFromSurvey}
                />,
    "review": <ReviewQuestion {...commonProps} currAnswer={currAnswer}/>,
    "onboarding": <OnboardingQuestion {...commonProps} onAnswerChange={onAnswerChange} answer={selectedAnswer} />,
    "grading": (
      <GradingQuestion
        {...commonProps}
        answer={answer}
        onGradingAnswerSave={onGradingAnswerSave}
        onFinishButtonDisableStateChange={onFinishButtonDisableStateChange}
        isGradingReview={isGradingReview}
      />
    )
  }[displayType]
};

export default Question;
