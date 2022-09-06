import "./styles.scss";

import React from "react";

import { statusConstants } from "./../../data/constants/statusConstants";

import { QuestionCircleFilled } from "@ant-design/icons";
import NpmRadioGroup from "../../../nmp-ui/NpmRadioGroup";
import NpmTextArea from "../../../nmp-ui/NpmTextArea";
import NpmInput from "../../../nmp-ui/NpmInput";

import Question from "../../../Surveys/Components/Question";
import NpmTooltip from "../../../nmp-ui/NpmTooltip";

const MemberQuestion = ({
  structureType,
  structureOptions,
  handleAnswerSelect,
  selectedAnswer,
  correctAnswer,
  hint,
}) => {
  return (
    <>
      <div className="answer-content">
        <div className="answer-header">
          {structureType === "multiple_choice" && <div className="answer-title"> Mark one answer:</div>}
          {structureType === "text" && <div className="answer-title"> Write your answer below:</div>}
          <div className="answer-tooltip">
            <NpmTooltip text={hint}>
              <QuestionCircleFilled />
            </NpmTooltip>
          </div>
        </div>
        <div className="answer-block">
          {structureType === "multiple_choice" && (
            <NpmRadioGroup
              options={structureOptions}
              handleAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
              correctAnswer={correctAnswer}
            />
          )}
          {structureType === "text" && (
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
      </div>
    </>
  );
};

export default MemberQuestion;
