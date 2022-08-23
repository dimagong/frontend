import "./styles.scss";

import React from "react";

import textValidationSchema from "./validationSchema";

import FieldLabel from "../FieldLabel";

const Text = (props) => {
  let fieldType = "text";

  const handleChange = (event) => props.onChange(event.target.value);

  return (
    <div className="custom-form-filed form-create_custom-text-widget">
      <FieldLabel label={props.label} required={props.isRequired} />
      <input
        id={props.id}
        type={fieldType}
        disabled={false}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder || "Enter your answer here"}
      />
    </div>
  );
};

Text.validationSchema = textValidationSchema;

export default Text;
