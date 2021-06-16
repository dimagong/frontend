import React from 'react';

import Question from "features/Surveys/Components/Question";

const SurveyReviewComponent = ({ surveyData }) => {

  return (
    <div>
      {surveyData.questions.map((question, index) => (
        <Question
          displayType="review"
          question={question}
          questionNumber={index + 1}
        />
      ))}
    </div>
  )
};

export default SurveyReviewComponent;
