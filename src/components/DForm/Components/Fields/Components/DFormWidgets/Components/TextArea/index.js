import React from 'react';

import FieldLabel from '../FieldLabel'

import './styles.scss'

const TextAreaWidget = ({value, onChange, options, label, disabled, isRequired}) => {


  return (
    <div>
      {/*{options.label !== false ? <FieldLabel label={label} required={required}/> : null}*/}
      <FieldLabel label={label} required={isRequired} />
      <textarea
        placeholder={"Enter your answer here"}
        value={""}
        onChange={() => {}}
        className="custom-textarea"
        rows="5"
        disabled={false}
        required={isRequired}
      />
    </div>
  )
}

export default TextAreaWidget;
