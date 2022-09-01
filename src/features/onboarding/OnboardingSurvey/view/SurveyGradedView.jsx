import React, { useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useGetAllSurveyQuestionsQuery } from "api/Onboarding/prospectUserQuery.js";
import { getSurveySubmitStatus } from "./../helpers/getSurveySubmitStatus";
import SurveyAdditionalInfoView from "./SurveyAdditionalInfoView";
import SurveyFeedbackNavigationView from "./SurveyFeedbackNavigationView";
import Question from "./../../../Surveys/Components/Question";
import SurveyStatusTopbar from "./../../OnboardingSurvey/components/OnboardingSurveyStatusComponent/components/SurveyStatusTopbar";
import SurveyStatusSection from "./../../OnboardingSurvey/components/OnboardingSurveyStatusComponent/components/SurveyStatusSection";
import ButtonSurveyStatus from "./../../OnboardingSurvey/components/OnboardingSurveyStatusComponent/components/ButtonSurveyStatus";

//./../OnboardingSurveyStatusComponent/components/SurveyStatusTopbar
const SurveyGradedView = ({ survey, surveyStatus, setIsFeedbackView, isLoadingSurvey, isFeedbackView }) => {
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);

  const { id, graded_at, is_show_result } = survey;
  console.log("survey", survey);

  const { data: surveyInteraction, isLoading: isSurveyGradedQuestionsLoading } = useGetAllSurveyQuestionsQuery(
    { id },
    { enabled: !!graded_at }
  );

  console.log("surveyInteraction", surveyInteraction);
  const isFeedbackExist = !!survey?.passedSurveyData?.answers.find((answer) => !!answer.feedback);

  //

  const { questions, answers } = surveyInteraction ?? {};
  const numberedQuestions = questions
    ? questions.map((question, index) => ({ ...question, questionNumber: index + 1 }))
    : [];

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

  const questionsToShow = answers
    ? answers.map((answer, index) => {
        if (is_show_result || answer.feedback) {
          return {
            question: numberedQuestions[index],
            answer: answer,
          };
        }
      })
    : [];
  const additionalText = questionsToShow[currQuestionIndex]?.answer?.feedback;
  const currAnswer = is_show_result
    ? questionsToShow[currQuestionIndex]?.answer
    : questionsToShow[currQuestionIndex]?.answer;
  const questionNumber = questionsToShow[currQuestionIndex]?.question.questionNumber;
  const questionCurrent = questionsToShow[currQuestionIndex]?.question;
  const displayType = is_show_result ? "review-prospect-onboarding" : "review-onboarding";
  const isSurveyPassed = survey && survey.total >= survey.min_percent_pass;
  if (isSurveyGradedQuestionsLoading) {
    return <>Loading ...</>;
  }
  if (isFeedbackView) {
    return (
      <Row className="onboarding-survey">
        <Col className="offset-md-1" sm={12} md={10}>
          <SurveyAdditionalInfoView
            className="onboarding-survey-manager_feedback"
            label={"Feedback"}
            text={additionalText}
          />
          <Card className="onboarding-survey_card">
            <CardBody>
              <Question
                currAnswer={currAnswer}
                questionNumber={questionNumber}
                question={questionCurrent}
                displayType={displayType}
              />
            </CardBody>
          </Card>
          <SurveyFeedbackNavigationView
            onFeedbackClose={() => setIsFeedbackView(false)}
            questionsToShow={questionsToShow}
            currQuestionIndex={currQuestionIndex}
            handleSwitchToPrevQuestion={handleSwitchToPrevQuestion}
            handleSwitchToNextQuestion={handleSwitchToNextQuestion}
          />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row className="onboarding_survey_result">
        <Col className="offset-md-1" sm={12} md={10}>
          <Card>
            <CardBody>
              <SurveyStatusTopbar time={survey.graded_at} />
              <SurveyStatusSection
                // isSurveyStatsLoading={isSurveyStatsLoading}
                isSurveyStatsLoading={isLoadingSurvey}
                isSurveyPassed={isSurveyPassed}
                surveyStats={survey.stats}
              />
              {(isFeedbackExist || survey.is_show_result) && (
                <div className="status_description_action d-flex justify-content-center">
                  <ButtonSurveyStatus onForceApplicationShow={setIsFeedbackView}>View feedback</ButtonSurveyStatus>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
};

export default SurveyGradedView;
