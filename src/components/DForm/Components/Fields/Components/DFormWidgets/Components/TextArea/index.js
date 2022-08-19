import "./styles.scss";

import React from "react";

import FieldLabel from "../FieldLabel";

import { DFormWidgetEventsTypes } from "../../events";

const TextAreaWidget = ({ value, onEvent, label, disabled, isRequired }) => {
  const handleChange = (e) => {
    onEvent({ type: DFormWidgetEventsTypes.Change, value: e.target.value });
  };

  return (
    <div>
      <FieldLabel label={label} required={isRequired} />
      <textarea
        placeholder={"Enter your answer here"}
        value={value}
        onChange={handleChange}
        className="custom-textarea"
        rows="5"
        disabled={disabled}
        required={isRequired}
      />
    </div>
  );
};

export default TextAreaWidget;
