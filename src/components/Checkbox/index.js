import "./styles.scss";

import React from "react";

const Checkbox = ({ displayType = "radio-like", className, label, onChange, checked }) => {
  return (
    <label className={`checkbox_container ${displayType} ${!label ? "no-label" : ""} ${className || ""}`}>
      {label}
      <input className="checkbox_container-hidden_input" type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkbox_container-check_mark" />
    </label>
  );
};

export default Checkbox;
