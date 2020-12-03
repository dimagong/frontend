import React from "react";

import './fieldStyles.scss'

export default function Field(props) {

  const {key, children, className, style} = props;

  return (
    <div
      style={style}
      className={`${className} custom-form-field`}
      key={key}
    >
      {children}
    </div>
  )
}
