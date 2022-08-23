import "./styles.scss";

import React from "react";

import FieldLabel from "../FieldLabel";

const TextAreaWidget = ({ value, onChange, label, disabled, isRequired }) => {
  const handleChange = (event) => onChange(event.target.value);

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
