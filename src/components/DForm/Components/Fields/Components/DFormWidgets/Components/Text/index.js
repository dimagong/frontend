import "./styles.scss";

import React from "react";

import textValidationSchema from "./validationSchema";

import FieldLabel from "../FieldLabel";
import { DFormWidgetEventsTypes } from "../../events";

const Text = (props) => {
  let fieldType = "text";

  const handleChange = (event) => {
    props.onEvent({ type: DFormWidgetEventsTypes.Change, value: event.target.value });
  };

  return (
    <div className={"custom-form-filed form-create_custom-text-widget"}>
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
