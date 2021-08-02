import React from 'react'

import './styles.scss';

const InputText = ({
  name,
  value,
  label,
  onChange,
  disabled,
  isRequired,
  isSystemField,
  placeholder,
  fieldId,
}) => {


  const handleInputChange = (e) => {
    onChange(e.target.value, fieldId);
  };

  return (
    <div className="member_firm-form_field">
      <label
        htmlFor={name || label}
        className="member_firm-form_field-label"
      >
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
    </div>
  )
};

const InputEmail = ({
                      name,
                      value,
                      label,
                      onChange,
                      disabled,
                      isRequired,
                      isSystemField,
  placeholder,
  fieldId,
                    }) => {

  const handleInputChange = (e) => {
    onChange(e.target.value, fieldId);
  };

  return (
    <div className="member_firm-form_field">
      <label
        htmlFor={name || label}
        className="member_firm-form_field-label"
      >
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
    </div>
  )
};

const InputNumber = ({
                       name,
                       value,
                       label,
                       onChange,
                       disabled,
                       isRequired,
                       isSystemField,
  placeholder,
                     }) => {
  return (
    <div className="member_firm-form_field">
      <label
        htmlFor={name || label}
        className="member_firm-form_field-label"
      >
        {label} {!!isRequired && "*"}
      </label>
      <input
        className="member_firm-form_field-input number_input"
        name={name || label}
        type="text"
        onChange={onChange}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
      />
    </div>
  )
};

export {
  InputText,
  InputEmail,
  InputNumber,
};
