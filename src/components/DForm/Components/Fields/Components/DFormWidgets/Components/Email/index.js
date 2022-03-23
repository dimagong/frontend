import React from "react";

import emailValidationSchema from "./validationSchema";
import "./styles.scss";

const Email = ({
                      name,
                      value,
                      label,
                      onChange,
                      disabled,
                      isRequired,
                      placeholder,
                      fieldId,
                      error,
                    }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value, fieldId);
  };

  return (
    <div
      className={`member_firm-form_field ${error ? "field_with_error" : ""}`}
    >
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
      {error && (
        <div className="member_firm-form_field-validation_error">{error}</div>
      )}
    </div>
  );
};

Email.validationSchema = emailValidationSchema;

export default Email;
