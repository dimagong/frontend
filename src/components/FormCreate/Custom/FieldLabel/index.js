import React from "react";

import "./styles.scss";

const FieldLabel = ({ label, className, required }) => {
  return (
    <div className={`field-label ${className ? className : ""}`}>
      <span>
        {label} {!!required && <span className="field-label_asterix">*</span>}
      </span>
    </div>
  );
};

export default FieldLabel;
