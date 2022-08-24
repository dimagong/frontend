import "./styles.scss";

import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const OnboardingSurveyFeedbackViewComponent = (props) => {
  const { surveyAdditionalInfoProps, surveyQuestionProps, surveyFeedbackNavigationProps } = props;

  return (
    <Row className="onboarding-survey">
      <Col className="offset-md-1" sm={12} md={10}>
        {surveyAdditionalInfoProps}
        <Card className="onboarding-survey_card">
          <CardBody>{surveyQuestionProps}</CardBody>
        </Card>
        {surveyFeedbackNavigationProps}
      </Col>
    </Row>
  );
};

export default OnboardingSurveyFeedbackViewComponent;
