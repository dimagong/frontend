import React from 'react';

import DesignerQuestion from "./Components/DesignerQuestion";

import './styles.scss'

const Question = ({ displayType, question, questionNumber, isSurveyDesigner, onEdit, onClick }) => {

  const commonProps = {
    displayType,
    questionNumber,
    questionData: question.latest_version,
  };

  return {
    "designer": <DesignerQuestion
                  {...commonProps}
                  isSurveyDesigner={isSurveyDesigner}
                  onEdit={onEdit}
                  onClick={onClick}
                />
  }[displayType]
};

export default Question;
