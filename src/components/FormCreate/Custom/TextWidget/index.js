import React from 'react';
import FieldLabel from '../FieldLabel'

import './styles.scss'

const Index = (props) => {
  let fieldType = 'text';

  if(props.schema?.type === 'number') {
    fieldType = 'number';
  }

  return (
    <div className="custom-form-filed form-create_custom-text-widget">
      <FieldLabel label={props.label} required={props.required}/>
      <input
        id={props.id}
        type={fieldType}
        disabled={props.disabled}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder || "Enter your answer here"}
      />
    </div>
  )
}

export default Index;
