import "./styles.scss";

import React from "react";

const FieldLabel = ({ label, className, required }) => {
  if (!label) return null;

  return (
    <div className={`field-label ${className ? className : ""}`}>
      <span>
        {label} {!!required && <span className="field-label_asterix">*</span>}
      </span>
    </div>
  );
};

export default FieldLabel;
