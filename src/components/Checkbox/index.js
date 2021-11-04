import React from 'react';

import './styles.scss';

const Checkbox = ({
  displayType = "radio-like",
  className,
  label,
  onClick,
  checked,
}) => {

  return (
    <label
      className={`checkbox_container ${displayType} ${!label ? "no-label" : ""} ${className || ""}`}
      onClick={onClick}
    >
      {label}
      <input className="checkbox_container-hidden_input" type="checkbox" checked={checked}/>
      <span className="checkbox_container-check_mark" />
    </label>
  )
};

export default Checkbox;
