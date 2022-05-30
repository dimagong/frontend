import React from "react";
import FieldLabel from "../FieldLabel";

import "./styles.scss";

const DateTimeInput = ({ value, onChange, options, label, disabled, required }) => {
  return (
    <div className={"custom-date-time-input-widget"}>
      {options.label !== false ? <FieldLabel label={label} required={required} /> : null}
      <input
        value={value}
        type="datetime-local"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default DateTimeInput;
