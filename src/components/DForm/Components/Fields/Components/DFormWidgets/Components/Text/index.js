import React from "react";

import textValidationSchema from "./validationSchema";
import "./styles.scss";

const Text = ({
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
        className="member_firm-form_field-input text_input"
        name={name || label}
        type="text"
        onChange={handleInputChange}
        disabled={disabled}
        value={value}
        placeholder={placeholder || `Type ${name}`}
      />
      {error && (
        <div className="member_firm-form_field-validation_error">{error}</div>
      )}
    </div>
  );
};

Text.validationSchema = textValidationSchema;

export default Text;
