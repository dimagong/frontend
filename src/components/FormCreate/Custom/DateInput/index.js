import React from "react";
import FieldLabel from "../FieldLabel";

import "./styles.scss";

const DateInput = ({ value, onChange, options, label, disabled, required }) => {
  return (
    <div className={"custom-date-input-widget"}>
      {options.label !== false ? <FieldLabel label={label} required={required} /> : null}
      <input
        value={value}
        type="date"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default DateInput;
