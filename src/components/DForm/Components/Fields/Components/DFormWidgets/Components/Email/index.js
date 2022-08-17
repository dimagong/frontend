import "./styles.scss";

import React from "react";

import emailValidationSchema from "./validationSchema";

import { DFormWidgetEventsTypes } from "../../events";

const Email = ({ name, value, label, onEvent, disabled, isRequired, placeholder, error }) => {
  const handleInputChange = (event) => {
    onEvent({ type: DFormWidgetEventsTypes.Change, value: event.target.value });
  };

  return (
    <div className={`member_firm-form_field ${error ? "field_with_error" : ""}`}>
      <label htmlFor={name || label} className="member_firm-form_field-label">
        {label} {!!isRequired && "*"}
      </label>
      <input
        className="member_firm-form_field-input email_input"
        name={name || label}
        type="email"
        onChange={handleInputChange}
        disabled={disabled}
        value={value}
        placeholder={placeholder || "example@email.com"}
      />
      {error && <div className="member_firm-form_field-validation_error">{error}</div>}
    </div>
  );
};

Email.validationSchema = emailValidationSchema;

export default Email;
