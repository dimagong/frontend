import React from 'react';

import LoadingButton from "components/LoadingButton";
import Question from "features/Surveys/Components/Question";

import './styles.scss'

const SurveyReviewComponent = ({
  surveyData,
  onAssignedSurveyDelete,
  isSurveyDeleteProceeding,
}) => {

  return (
    <div className="survey-review-component">
      {surveyData.questions.map((question, index) => {
        let ans = surveyData.answers.find(item => item.question_id === question.id)?.answer
        return (
        <Question
          displayType="review"
          question={question}
          questionNumber={index + 1}
          currAnswer={ans ? ans : '-1'}
        />
      )})}
      <LoadingButton
        onClick={onAssignedSurveyDelete}
        className="survey-review-component_delete-survey"
        value="Delete survey"
        color="danger"
        isLoading={isSurveyDeleteProceeding}
      />
    </div>
  )
};

export default SurveyReviewComponent;
