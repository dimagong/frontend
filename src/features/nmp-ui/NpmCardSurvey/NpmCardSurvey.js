import "./styles.scss";

import React, { useEffect } from "react";

import PropTypes from "prop-types";

import NpmCard from "./../NpmCard";
import NpmStepper from "./../NpmStepper";
import NpmButton from "../NpmButton";
import { statusConstants } from "../../members/data/constants/statusConstants";
import Question from "../../Surveys/Components/Question";
import NpmRadioGroup from "../NpmRadioGroup";
import NpmInput from "../NpmInput";
import NpmTextArea from "../NpmTextArea";

import { QuestionCircleFilled, LeftSquareFilled } from "@ant-design/icons";

const NpmCardSurvey = (props) => {
  const {
    surveyStatus,
    handleSurveyStart,
    currentIndex,
    count,
    title,
    question,
    handleAnswerSelect,
    selectedAnswer,
    currentQuestionAnswer,
    handleSwitchToPreviousQuestion,
    handleAnswerSubmit,
  } = props;

  useEffect(() => {
    if (currentQuestionAnswer) {
      handleAnswerSelect(currentQuestionAnswer.answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionAnswer]);

  console.log("NpmCardSurvey count", count);
  console.log("NpmCardSurvey currentIndex", currentIndex);
  // console.log("NpmCardSurvey title", title);
  // console.log("NpmCardSurvey surveyStatus", surveyStatus);
  console.log("NpmCardSurvey currentIndex", currentIndex);

  return (
    <NpmCard title="Surveys" style={{ maxHeight: "646px", maxWidth: "783px", width: "57vw" }}>
      <div className="surveys-content">
        <div className="content_stepper">
          <NpmStepper currentStrep={currentIndex + 1} totalSteps={count} />
        </div>
        <div className="content_question">
          <div className="question-title">
            {surveyStatus === statusConstants.STARTED && question && `Question ${currentIndex + 1}`}
            {surveyStatus === statusConstants.NOT_STARTED && title}
          </div>
          <div className="question-subtitle">
            {surveyStatus === statusConstants.STARTED && question?.body}
            {surveyStatus === statusConstants.NOT_STARTED && "Click the button to get started."}
          </div>
        </div>
        <div className="answer-content">
          {surveyStatus === statusConstants.STARTED && (
            <>
              <div className="answer-header">
                {question?.answer_structure.type === "multiple_choice" && (
                  <div className="answer-title"> Mark one answer:</div>
                )}
                {question?.answer_structure.type === "text" && (
                  <div className="answer-title"> Write your answer below:</div>
                )}
                <div className="answer-tooltip">
                  <QuestionCircleFilled />
                </div>
              </div>
              <div className="answer-block">
                {question?.answer_structure.type === "multiple_choice" && (
                  <NpmRadioGroup
                    options={question?.answer_structure.options}
                    handleAnswerSelect={handleAnswerSelect}
                    selectedAnswer={selectedAnswer}
                  />
                )}
                {question?.answer_structure.type === "text" && (
                  // <NpmInput onChange={handleAnswerSelect} value={selectedAnswer} />
                  <NpmTextArea onChange={handleAnswerSelect} value={selectedAnswer} />
                )}

                {/* <div>
                  <Question
                    initAnswer={currentQuestionAnswer}
                    questionNumber={currentIndex + 1}
                    question={question}
                    displayType={"onboarding"}
                    onAnswerChange={handleAnswerSelect}
                    selectedAnswer={selectedAnswer}
                  />
                </div> */}
              </div>
            </>
          )}
        </div>
        <div className="content_buttons">
          <div>
            {surveyStatus === statusConstants.NOT_STARTED && (
              <div>
                <NpmButton onClick={() => handleSurveyStart()}>
                  <span>Begin</span>
                  <i className="arrow right"></i>
                </NpmButton>
              </div>
            )}
            {surveyStatus === statusConstants.STARTED && (
              <div>
                {!!currentIndex && (
                  <NpmButton
                    onClick={() => handleSwitchToPreviousQuestion()}
                    style={{ backgroundColor: "white", color: "black", marginRight: "30px" }}
                  >
                    <i className="arrow left"></i>
                    <span>Back</span>
                  </NpmButton>
                )}
                <NpmButton onClick={() => handleAnswerSubmit()}>
                  <span>{currentIndex === count - 1 ? "Finish" : "Next"}</span>
                  <i className="arrow right"></i>
                </NpmButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </NpmCard>
  );
};

export default NpmCardSurvey;
