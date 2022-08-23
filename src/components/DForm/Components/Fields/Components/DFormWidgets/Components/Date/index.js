import "./styles.scss";

import React from "react";

import dateValidationSchema from "./validationSchema";

import FieldLabel from "../FieldLabel";

const DateWidget = ({ value, onChange, options, label, disabled, required, format }) => {
  const propsByFormat = {
    date: { className: "custom-date-input-widget", type: "date" },
    "date-time": { className: "custom-date-time-input-widget", type: "datetime-local" },
  };

  const { className, type } = propsByFormat[format];

  const handleOnChange = (event) => onChange(event.target.value);

  return (
    <div className={className}>
      {options?.label !== false ? <FieldLabel label={label} required={required} /> : null}
      <input value={value} type={type} onChange={handleOnChange} disabled={disabled} />
    </div>
  );
};

DateWidget.validationSchema = dateValidationSchema;

export default DateWidget;
