import React from "react";

import { Button } from "reactstrap";
import { ChevronLeft, ChevronRight } from "react-feather";

const SurveyFeedbackNavigationView = ({
  onFeedbackClose,
  questionsToShow,
  currQuestionIndex,
  handleSwitchToPrevQuestion,
  handleSwitchToNextQuestion,
}) => {
  return (
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
  );
};

export default SurveyFeedbackNavigationView;
