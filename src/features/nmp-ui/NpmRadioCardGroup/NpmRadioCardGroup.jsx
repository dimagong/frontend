import "./styles.scss";

import React from "react";

import { Radio, Card } from "antd";

const NpmRadioCardGroup = ({ options = [], handleAnswerSelect, selectedAnswer, correctAnswer = null }) => {
  const onChange = (e) => {
    handleAnswerSelect(e.target.value);
  };
  const correctAnswerStyle = correctAnswer
    ? correctAnswer === selectedAnswer
      ? "correctAnswerStyle"
      : "incorrectAnswerStyle"
    : "";

  return (
    <Radio.Group onChange={onChange} value={selectedAnswer}>
      <div className="radio-group">
        {options.map((question) => {
          return (
            <Card>
              <Radio className={correctAnswerStyle} value={question.id}>
                {question.text}
              </Radio>
            </Card>
          );
        })}
      </div>
    </Radio.Group>
  );
};

export default NpmRadioCardGroup;
