import Checkbox from "../../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import {Check} from "react-feather";
import React from "react";

export function CheckboxWidget(props) {
  const onChange = (event) => {
    return props.onChange(event.target.checked);
  };

  return (
    <div>
      {props.options.label ? <label>{props.label}</label> : null}
      <Checkbox
        id={props.id}
        color="primary"
        disabled={props.disabled}
        required={props.required}
        icon={<Check className="vx-icon" size={16}/>}
        onChange={event => onChange(event)}
        label={props.label}
        checked={typeof props.value === "undefined" ? false : props.value}
      />
    </div>
  );
};
