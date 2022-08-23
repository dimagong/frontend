import "./styles.scss";

import React from "react";

import emailValidationSchema from "./validationSchema";

import FieldLabel from "../FieldLabel";

const Email = ({ name, value, label, onChange, disabled, isRequired, placeholder, error }) => {
  const handleInputChange = (event) => onChange(event.target.value);

  return (
    <div className={`member_firm-form_field ${error ? "field_with_error" : ""}`}>
      <FieldLabel label={label} required={isRequired} />

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
