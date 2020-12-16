import React from 'react';

import FieldLabel from '../FieldLabel'

import './styles.scss'

const TextAreaWidget = ({value, onChange, options, label, disabled, required}) => {


  return (
    <div>
      {options.label !== false ? <FieldLabel label={label} /> : null}
      <textarea
        placeholder={"Enter your answer here"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="custom-textarea"
        rows="5"
        disabled={disabled}
        // required={required}
      />
    </div>
  )
}

export default TextAreaWidget;
