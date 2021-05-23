import React from 'react';

import DesignerQuestion from "./Components/DesignerQuestion";

import './styles.scss'

const Question = ({ displayType, question, questionNumber, isSurveyDesigner, onEdit, onClick, isInSurvey, isSelected, handleRemoveQuestionFromSurvey }) => {

  const commonProps = {
    displayType,
    questionNumber,
    questionData: question,
  };

  return {
    "designer": <DesignerQuestion
                  {...commonProps}
                  isSurveyDesigner={isSurveyDesigner}
                  onEdit={onEdit}
                  onClick={onClick}
                  isInSurvey={isInSurvey}
                  isSelected={isSelected}
                  onRemove={handleRemoveQuestionFromSurvey}
                />
  }[displayType]
};

export default Question;
