import React from "react";

import { Card, CardBody, Col, Row, Spinner } from "reactstrap";
import OnboardingSurveyProgressBar from "./components/OnboardingSurveyProgressBar";
import LoadingButton from "components/LoadingButton";
import Question from "../../../../Surveys/Components/Question";

import SurveyAdditionalInfoComponent from "./components/SurveyAdditionalInfoComponent";

import { ChevronRight, ChevronLeft } from "react-feather";

import "./styles.scss";

const OnboardingSurveyBeginComponent = ({ surveyName }) => {
  return (
    <div className="onboarding-survey_begin">
      <div className="onboarding-survey_begin_survey-name">{surveyName}</div>
      <div className="onboarding-survey_begin_note">Click begin to start</div>
    </div>
  );
};

const OnboardingSurveyInProgress = ({ question, questionNumber, selectedAnswer, onAnswerChange, initAnswer }) => {
  return (
    <div>
      <Question
        initAnswer={initAnswer}
        questionNumber={questionNumber}
        question={question}
        displayType={"onboarding"}
        onAnswerChange={onAnswerChange}
        selectedAnswer={selectedAnswer}
      />
    </div>
  );
};

const OnboardingSurveyComponent = ({
  surveyName,
  status,
  onSurveyStart,
  isLoading,
  isLastQuestion,
  question,
  questionNumber,
  onAnswerChange,
  selectedAnswer,
  progress,
  isAnswerPushProceed,
  onAnswerSubmit,
  isSurveyBeginProceed,
  surveyDescription,
  isFirstQuestion,
  onSwitchToPreviousQuestion,
  isSurveySwitchToPreviousQuestionProceed,
  isAbleToSwitchToPreviousQuestion,
  currentQuestionAnswer,
}) => {
  const getButtonValue = () => {
    if (isLastQuestion) {
      return "Finish";
    } else if (status === "notStarted") {
      return "Begin";
    } else if (status === "started") {
      return "Next";
    }
  };

  const handleActionButtonClick = () => {
    if (status === "notStarted") {
      onSurveyStart();
    } else {
      onAnswerSubmit();
    }
  };

  const handleSwitchToPreviousQuestion = () => {
    onSwitchToPreviousQuestion();
  };

  const isBackButtonVisible =
    !isFirstQuestion && status === "started" && !isLoading && isAbleToSwitchToPreviousQuestion;

  return (
    <Row className="onboarding-survey">
      <Col className="offset-md-1" sm={12} md={10}>
        <Card className="onboarding-survey_card">
          <CardBody>
            {isLoading ? (
              <div className="onboarding-survey_loading">
                <Spinner color="primary" size="40" />
              </div>
            ) : (
              <>
                {
                  {
                    started: (
                      <OnboardingSurveyInProgress
                        onAnswerChange={onAnswerChange}
                        selectedAnswer={selectedAnswer}
                        question={question}
                        questionNumber={questionNumber}
                        initAnswer={currentQuestionAnswer}
                      />
                    ),
                    notStarted: <OnboardingSurveyBeginComponent surveyName={surveyName} />,
                  }[status]
                }
              </>
            )}
          </CardBody>
        </Card>

        <OnboardingSurveyProgressBar progressPercents={question ? progress : 0} />

        {status !== "finished" && (
          <div className="onboarding-survey_actions">
            {isBackButtonVisible ? (
              <LoadingButton
                className="onboarding-survey_actions_back"
                color="primary"
                disabled={isAnswerPushProceed}
                isLoading={isSurveySwitchToPreviousQuestionProceed}
                onClick={handleSwitchToPreviousQuestion}
                value={
                  <div className="onboarding-survey_actions_back_value">
                    <ChevronLeft className="onboarding-survey_actions_back_value_icon" /> Back
                  </div>
                }
              />
            ) : (
              <div />
            )}
            <LoadingButton
              className="onboarding-survey_actions_next"
              color="primary"
              isLoading={isSurveyBeginProceed || isAnswerPushProceed || isLoading}
              onClick={handleActionButtonClick}
              value={
                <div className="onboarding-survey_actions_next_value">
                  {getButtonValue()} <ChevronRight className="onboarding-survey_actions_next_value_icon" />
                </div>
              }
            />
          </div>
        )}

        <SurveyAdditionalInfoComponent
          className="onboarding-survey-manager_comments"
          label={"Guidance"}
          text={surveyDescription}
        />
      </Col>
    </Row>
  );
};

export default OnboardingSurveyComponent;
