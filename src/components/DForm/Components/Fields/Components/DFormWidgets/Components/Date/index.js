import React from "react";
import FieldLabel from "../FieldLabel";
import dateValidationSchema from "./validationSchema";

import "./styles.scss";
import { DFormWidgetEventsTypes } from "../../events";

const DateWidget = ({ value, onEvent, options, label, disabled, required, format }) => {
  const propsByFormat = {
    date: { className: "custom-date-input-widget", type: "date" },
    "date-time": { className: "custom-date-time-input-widget", type: "datetime-local" },
  };

  const { className, type } = propsByFormat[format];

  const handleOnChange = (event) => {
    onEvent({ type: DFormWidgetEventsTypes.Change, value: event.target.value });
  };

  return (
    <div className={className}>
      {options?.label !== false ? <FieldLabel label={label} required={required} /> : null}
      <input value={value} type={type} onChange={handleOnChange} disabled={disabled} />
    </div>
  );
};

DateWidget.validationSchema = dateValidationSchema;

export default DateWidget;
