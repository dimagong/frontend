import "./styles.scss";

import React from "react";
import { QuestionCircleFilled } from "@ant-design/icons";

import { NpmTooltip, NpmInput, NpmTextArea, NpmRadioCardGroup } from "features/nmp-ui";

const MemberSurveyQuestion = ({
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
            <NpmTooltip title={hint}>
              <QuestionCircleFilled />
            </NpmTooltip>
          </div>
        </div>
        <div className="answer-block">
          {structureType === "multiple_choice" && (
            <NpmRadioCardGroup
              options={structureOptions}
              handleAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
              correctAnswer={correctAnswer}
            />
          )}
          {structureType === "text" && <NpmInput onChange={handleAnswerSelect} value={selectedAnswer} />}
          {structureType === "textArea" && <NpmTextArea onChange={handleAnswerSelect} value={selectedAnswer} />}

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

export default MemberSurveyQuestion;