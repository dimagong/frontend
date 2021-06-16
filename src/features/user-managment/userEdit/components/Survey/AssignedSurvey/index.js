import React from 'react';

import AssignedSurveyComponent from "./components/AssignedSurveyComponent";

const AssignedSurvey = ({ surveyData }) => {

  console.log("assigned survey", surveyData);

  return (
    <AssignedSurveyComponent
      surveyData={surveyData}
      status={"review"}
    />
  )
};

export default AssignedSurvey;
