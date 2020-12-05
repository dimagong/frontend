import React from 'react';

import './styles.scss'

const FieldLabel = ({ label, className }) => {

  return (
    <div className={`field-label ${className ? className : ""}`}>
      <span>
        {label}
      </span>
    </div>
  )
}

export default FieldLabel;
