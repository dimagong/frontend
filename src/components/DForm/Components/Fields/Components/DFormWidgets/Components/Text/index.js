import React from "react";

import textValidationSchema from "./validationSchema";
import "./styles.scss";

import FieldLabel from "../FieldLabel";

import "./styles.scss";

const Text = (props) => {
  let fieldType = "text";

  return (
    <div className={"custom-form-filed form-create_custom-text-widget"}>
      <FieldLabel label={props.label} required={props.isRequired} />
      <input
        id={123}
        type={fieldType}
        disabled={false}
        value={props.value}
        onChange={() => {}}
        placeholder={props.placeholder || "Enter your answer here"}
      />
    </div>
  );
};

Text.validationSchema = textValidationSchema;

export default Text;
