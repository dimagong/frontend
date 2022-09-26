import "./styles.scss";

import React from "react";
import { QuestionCircleFilled } from "@ant-design/icons";

import { NpmTooltip, NmpInput, NmpTextArea, NpmRadioCardGroup } from "features/nmp-ui";

const MemberSurveyQuestion = ({
  structureType,
  structureOptions,
  handleAnswerSelect,
  selectedAnswer,
  correctAnswer,
  hint,
}) => {
  const onAnswerInputChange = (event) => handleAnswerSelect(event.target.value);

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

          {structureType === "text" && <NmpInput onChange={onAnswerInputChange} value={selectedAnswer} />}

          {structureType === "textArea" && <NmpTextArea onChange={onAnswerInputChange} value={selectedAnswer} />}
        </div>
      </div>
    </>
  );
};

export default MemberSurveyQuestion;
