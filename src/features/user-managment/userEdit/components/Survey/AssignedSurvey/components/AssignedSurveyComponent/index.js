import React from 'react';

import SurveyReviewComponent from "./components/SurveyReviewComponent";

import './styles.scss'

const AssignedSurveyComponent = ({ surveyData, status }) => {


  return (
    <div className={"assigned-survey"}>
      <div className={"assigned-survey_header"}>
        <div className={"d-flex"}>
          <div className={"assigned-survey_header_title"}>
            Survey
          </div>
          <div className={"assigned-survey_header_survey-name"}>
            {surveyData.title}
          </div>
        </div>
        <div className="assigned-survey_header_version">
          Latest v03.03.2021:0 By Brad Powar
        </div>
      </div>
      <div className={"assigned-survey_body"}>
        {{
          "review": <SurveyReviewComponent surveyData={surveyData} />
        }[status]}
      </div>
    </div>
  );
};

export default AssignedSurveyComponent;
