import React from "react";

import "./styles.scss";

const Input = ({ value, onChange, placeholder, className, label, name, ...rest }) => {
  return (
    <div className={`survey-input-component ${className || ""}`}>
      {!!label && (
        <label className="survey-input-component_label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label}`}
        className="survey-input-component_input"
        {...rest}
      />
    </div>
  );
};

export default Input;
