import React from "react";
import { Check } from "react-feather";

import { CustomCheckbox } from "components/FormCreate/Custom/CheckboxesWidget/CheckboxesWidget";

import booleanValidationSchema from "./validationSchema";

const CheckboxWidget = (props) => {
  const onChange = (event) => props.onChange(event.target.checked);

  return (
    <div>
      {/*<FieldLabel label={props.label} required={props.isRequired} />*/}
      <div
        style={{
          marginBottom: "20px",
          marginLeft: "30px",
          margin: "20px 30px",
        }}
      >
        <CustomCheckbox
          id={props.id}
          color="primary"
          disabled={props.disabled}
          required={props.isRequired}
          icon={<Check className="vx-icon" size={16} />}
          onChange={(event) => onChange(event)}
          label={props.name}
          checked={typeof props.value === "undefined" ? false : props.value}
        />
      </div>
    </div>
  );
};

CheckboxWidget.validationSchema = booleanValidationSchema;

export default CheckboxWidget;
