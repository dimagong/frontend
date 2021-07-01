import React from 'react';

import Question from "features/Surveys/Components/Question";
import LoadingButton from "components/LoadingButton";


import './styles.scss'

const SurveyGradingComponent = ({ surveyData, onQuestionAnswerGradingSave, onFinishGrading, onFinishButtonDisableStateChange, isFinishButtonDisabled, isGradingReview, onForceSurveyReviewHide }) => {

  const handleFinishGrading = () => {

    if (!surveyData.graded_at) {
      onFinishGrading(surveyData.id)
    }
  };


  const handleGradingAnswerSave = (gradingData) => {
    onQuestionAnswerGradingSave(gradingData)
  };

  return (
    <div className="survey-grading-component">
      {surveyData.questions.map((question, index) => (
        <Question
          displayType="grading"
          question={question}
          questionNumber={index + 1}
          answer={surveyData.answers[index]}
          onGradingAnswerSave={handleGradingAnswerSave}
          onFinishButtonDisableStateChange={onFinishButtonDisableStateChange}
          isGradingReview={isGradingReview}
        />
      ))}
      {!surveyData.graded_at ? (
        <LoadingButton
          className="survey-grading-component_finish-grading"
          value="Finish grading"
          color="primary"
          onClick={handleFinishGrading}
          disabled={isFinishButtonDisabled}
        />
      ) : (
        <LoadingButton
          className="survey-grading-component_finish-grading"
          value="View results"
          color="primary"
          onClick={onForceSurveyReviewHide}
        />
      )}
    </div>
  )
};

export default SurveyGradingComponent;
