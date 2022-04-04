import React from 'react';

import FieldLabel from '../FieldLabel'

import './styles.scss'

const TextAreaWidget = ({value, onChange, options, label, disabled, required}) => {


  return (
    <div>
      {/*{options.label !== false ? <FieldLabel label={label} required={required}/> : null}*/}
      <FieldLabel label={label} required={true} />
      <textarea
        placeholder={"Enter your answer here"}
        value={""}
        onChange={() => {}}
        className="custom-textarea"
        rows="5"
        disabled={false}
        // required={required}
      />
    </div>
  )
}

export default TextAreaWidget;
