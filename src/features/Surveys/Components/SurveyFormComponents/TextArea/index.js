import React from 'react';

import './styles.scss';

const TextArea = ({ label, name, height, value, onChange, disabled, className }) => {

  return (
    <div className={`survey-textarea-component ${className || ""}`}>
      {!!label && (
        <label
          className="survey-textarea-component_label"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        rows={height}
        disabled={disabled}
      />
    </div>
  )
};

export default TextArea;
