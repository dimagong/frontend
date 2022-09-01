import "./styles.scss";

import React, { useState } from "react";

import { Radio, Card } from "antd";

const NpmRadioGroup = ({ options, handleAnswerSelect, selectedAnswer }) => {
  console.log("NpmRadioGroup options", options);
  console.log("selectedAnswer", selectedAnswer);
  const [value, setValue] = useState(null);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    // setValue(e.target.value);
    handleAnswerSelect(e.target.value);
  };

  return (
    <Radio.Group onChange={onChange} value={selectedAnswer}>
      <div className="radio-group">
        {options.map((question) => {
          return (
            <Card>
              <Radio value={question.id}>{question.text}</Radio>
            </Card>
          );
        })}
      </div>
    </Radio.Group>
  );
};

export default NpmRadioGroup;
