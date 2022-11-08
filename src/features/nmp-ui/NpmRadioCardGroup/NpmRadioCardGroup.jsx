import "./styles.scss";

import React from "react";

import { Radio, Card } from "antd";

const NpmRadioCardGroup = ({ options = [], handleAnswerSelect, selectedAnswer, correctAnswer = null }) => {
  const onChange = (e) => {
    if (!handleAnswerSelect) return;

    handleAnswerSelect(e.target.value);
  };
  const correctAnswerStyle = correctAnswer
    ? correctAnswer === selectedAnswer
      ? "correctAnswerStyle"
      : "incorrectAnswerStyle"
    : "";

  return (
    <div className="radio-groups-component">
      <Radio.Group onChange={onChange} value={selectedAnswer}>
        <div className="radio-group">
          {options.map((question) => {
            return (
              <Card key={question.id}>
                <Radio className={correctAnswerStyle} value={question.id}>
                  {question.text}
                </Radio>
              </Card>
            );
          })}
        </div>
      </Radio.Group>
    </div>
  );
};

export default NpmRadioCardGroup;
