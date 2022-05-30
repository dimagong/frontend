import React, { useState } from "react";
import { Card, CardBody, Col, Row, Button } from "reactstrap";
import Question from "../../../../Surveys/Components/Question";
import SurveyAdditionalInfoComponent from "../OnboardingSurveyComponent/components/SurveyAdditionalInfoComponent";

import "./styles.scss";
import { ChevronLeft, ChevronRight } from "react-feather";

const OnboardingSurveyFeedbackViewComponent = ({ questions, answers, onFeedbackClose, showResult }) => {
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);

  const numberedQuestions = questions.map((question, index) => ({ ...question, questionNumber: index + 1 }));

  const questionsToShow = [];

  // eslint-disable-next-line array-callback-return
  answers.map((answer, index) => {
    if (showResult || answer.feedback) {
      questionsToShow.push({
        question: numberedQuestions[index],
        answer: answer,
      });
    }
  });

  const handleSwitchToNextQuestion = () => {
    if (questionsToShow.length - 1 >= currQuestionIndex + 1) {
      setCurrQuestionIndex(currQuestionIndex + 1);
    }
  };

  const handleSwitchToPrevQuestion = () => {
    if (currQuestionIndex !== 0) {
      setCurrQuestionIndex(currQuestionIndex - 1);
    }
  };

  return (
    <Row className="onboarding-survey">
      <Col className="offset-md-1" sm={12} md={10}>
        <SurveyAdditionalInfoComponent
          className="onboarding-survey-manager_feedback"
          label={"Feedback"}
          text={questionsToShow[currQuestionIndex].answer.feedback}
        />

        <Card className="onboarding-survey_card">
          <CardBody>
            <Question
              currAnswer={
                showResult ? questionsToShow[currQuestionIndex].answer : questionsToShow[currQuestionIndex].answer
              }
              questionNumber={questionsToShow[currQuestionIndex].question.questionNumber}
              question={questionsToShow[currQuestionIndex].question}
              displayType={showResult ? "review-prospect-onboarding" : "review-onboarding"}
            />
          </CardBody>
        </Card>

        <div className="onboarding-survey-feedback_action_buttons">
          <Button
            className={"onboarding-survey-feedback_action_buttons-button dark"}
            onClick={onFeedbackClose}
            color="primary"
          >
            Close
          </Button>
          <div className={"d-flex"}>
            {questionsToShow.length !== 1 && (
              <>
                <Button
                  disabled={currQuestionIndex === 0}
                  onClick={handleSwitchToPrevQuestion}
                  className={"onboarding-survey-feedback_action_buttons-button back dark"}
                  color="primary"
                >
                  Back <ChevronLeft className="onboarding-survey_actions_back_value_icon" />
                </Button>
                <Button
                  disabled={currQuestionIndex === questionsToShow.length - 1}
                  onClick={handleSwitchToNextQuestion}
                  className={"onboarding-survey-feedback_action_buttons-button next "}
                  color="primary"
                >
                  Next <ChevronRight className="onboarding-survey_actions_next_value_icon" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OnboardingSurveyFeedbackViewComponent;
