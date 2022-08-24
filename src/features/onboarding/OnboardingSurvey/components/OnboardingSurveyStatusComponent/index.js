import "./styles.scss";

import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

import SurveyStatusTopbar from "./components/SurveyStatusTopbar";
import SurveyStatusSection from "./components/SurveyStatusSection";
import ButtonSurveyStatus from "./components/ButtonSurveyStatus";
import MessagesSurveyStatus from "./components/MessagesSurveyStatus";

const OnboardingSurveyStatusComponent = ({
  survey,
  status,
  onForceApplicationShow,
  isAllApplicationsCompleted,
  isFeedbackExist,
  ...props
}) => {
  //const isSurveyPassed = surveyStats && surveyStats.total >= surveyStats.min_percent_pass;

  const { surveyStatusTopbarProps, surveyStatusSectionProps, buttonSurveyStatusProps } = props;

  return status === "approved" ? (
    <>
      <Row className="onboarding_survey_result">
        <Col className="offset-md-1" sm={12} md={10}>
          <Card>
            <CardBody>
              {surveyStatusTopbarProps}
              {surveyStatusSectionProps}
              {(isFeedbackExist || survey.is_show_result) && (
                <div className="status_description_action d-flex justify-content-center">{buttonSurveyStatusProps}</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <>
      <MessagesSurveyStatus
        status={status}
        isAllApplicationsCompleted={isAllApplicationsCompleted}
        isFeedbackExist={isFeedbackExist}
        is_show_result={survey.is_show_result}
      >
        <ButtonSurveyStatus onForceApplicationShow={onForceApplicationShow}>View feedback</ButtonSurveyStatus>
      </MessagesSurveyStatus>
    </>
  );
};

export default OnboardingSurveyStatusComponent;
