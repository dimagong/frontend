import React from "react";
import FieldLabel from "../FieldLabel";

const NumberWidget = (props) => {
  return (
    <div className={"custom-form-filed form-create_custom-text-widget"}>
      <FieldLabel label={props.label} required={props.isRequired} />
      <input
        id={123}
        type="number"
        disabled={false}
        value={""}
        onChange={() => {}}
        placeholder={props.placeholder || "Enter your answer here"}
      />
    </div>
  );
};

export default NumberWidget;
