import React from "react";

export default function Field(props) {

  const {key, children, className, style} = props;

  return <div

    style={style}
    className={className + ' mb-1'}
    key={key}
  >
    {children}
  </div>
}
