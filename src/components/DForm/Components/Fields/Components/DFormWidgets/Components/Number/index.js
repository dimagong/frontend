import React from "react";
import FieldLabel from "../FieldLabel";

const NumberWidget = (props) => {
  const handleChange = (event) => props.onChange(event.target.value);

  return (
    <div className={"custom-form-filed form-create_custom-text-widget"}>
      <FieldLabel label={props.label} required={props.isRequired} />
      <input
        id={props.id}
        type="number"
        disabled={false}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder || "Enter your answer here"}
      />
    </div>
  );
};

export default NumberWidget;
