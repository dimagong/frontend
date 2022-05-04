import React from "react";

import SurveyReviewComponent from "./components/SurveyReviewComponent";
import SurveyGradingComponent from "./components/SurveyGradingComponent";
import CompletedSurveyComponent from "./components/CompletedSurveyComponent";

import "./styles.scss";

const AssignedSurveyComponent = ({
  surveyData,
  status,
  onQuestionAnswerGradingSave,
  onFinishGrading,
  onFinishButtonDisableStateChange,
  isGradingReview,
  onForceSurveyReviewShow,
  onForceSurveyReviewHide,
  onAssignedSurveyDelete,
  isSurveyDeleteProceeding,
  onFeedbackSubmit,
  isFeedbackSubmitProceeding,
  isFinishButtonDisabled,
}) => {
  const commonAssignedSurveyComponentsProps = {
    isSurveyDeleteProceeding,
    surveyData,
    onAssignedSurveyDelete,
  };

  return (
    <div className={"assigned-survey"}>
      <div className={"assigned-survey_header"}>
        <div className={"d-flex"}>
          <div className={"assigned-survey_header_title"}>Survey</div>
          <div className={"assigned-survey_header_survey-name"}>{surveyData.title}</div>
        </div>
        <div className="assigned-survey_header_survey-version">{surveyData.interaction_version.current_version}</div>
      </div>
      <div className={"assigned-survey_body"}>
        {
          {
            review: <SurveyReviewComponent {...commonAssignedSurveyComponentsProps} />,
            grading: (
              <SurveyGradingComponent
                isFeedbackSubmitProceeding={isFeedbackSubmitProceeding}
                answers={surveyData.answers}
                onFeedbackSubmit={onFeedbackSubmit}
                isGradingReview={isGradingReview}
                onQuestionAnswerGradingSave={onQuestionAnswerGradingSave}
                onFinishGrading={onFinishGrading}
                onFinishButtonDisableStateChange={onFinishButtonDisableStateChange}
                onForceSurveyReviewHide={onForceSurveyReviewHide}
                isFinishButtonDisabled={isFinishButtonDisabled}
                {...commonAssignedSurveyComponentsProps}
              />
            ),
            results: (
              <CompletedSurveyComponent
                onForceSurveyReviewShow={onForceSurveyReviewShow}
                {...commonAssignedSurveyComponentsProps}
              />
            ),
          }[status]
        }
      </div>
    </div>
  );
};

export default AssignedSurveyComponent;
