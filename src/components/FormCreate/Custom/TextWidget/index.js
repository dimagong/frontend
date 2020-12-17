import React from 'react';

import './styles.scss'

const Index = (props) => {
  let fieldType = 'text';

  if(props.schema?.type === 'number') {
    fieldType = 'number';
  }

  return (
    <div className="custom-form-filed form-create_custom-text-widget">
      <label htmlFor={props.id}>
        {props.label}
      </label>
      <input
        id={props.id}
        type={fieldType}
        disabled={props.disabled}
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder || "Enter your answer here"}
      />
    </div>
  )
}

export default Index;
