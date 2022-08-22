import "./styles.scss";

import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const OnboardingSurveyFeedbackViewComponent = ({ children }) => {
  const [SurveyAdditionalInfoComponent, Question, SurveyFeedbackNavigation] = children;

  return (
    <Row className="onboarding-survey">
      <Col className="offset-md-1" sm={12} md={10}>
        {SurveyAdditionalInfoComponent}
        <Card className="onboarding-survey_card">
          <CardBody>{Question}</CardBody>
        </Card>
        {SurveyFeedbackNavigation}
      </Col>
    </Row>
  );
};

export default OnboardingSurveyFeedbackViewComponent;
