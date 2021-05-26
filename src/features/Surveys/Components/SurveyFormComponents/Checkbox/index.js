import React from 'react';

import './styles.scss';

const Checkbox = ({ name, label, className, checked, onChange }) => {

  return (
    <div className={`survey-checkbox-component ${className && className}`}>
      <input
        onChange={onChange}
        checked={checked}
        className="survey-checkbox-component_input"
        id={name}
        type="checkbox"
      />
      <label
        className="survey-checkbox-component_label"
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  )
};

export default Checkbox;
