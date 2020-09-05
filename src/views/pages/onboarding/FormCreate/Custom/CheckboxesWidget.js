import Checkbox from "../../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import {Check} from "react-feather";
import React from "react";
import rfdc from "rfdc";
const clone = rfdc();

export function CheckboxesWidget(props) {
  let onChange = (option) => {
    let values = clone(props.value);

    let indexCheckbox = values.indexOf(option.value);
    if (indexCheckbox !== -1) {
      values.splice(indexCheckbox, 1)
    } else {
      values.push(option.value);
    }
    return values;
  };
  return (
    props.options.enumOptions.map((option, key) => {
      return <Checkbox
        color="primary"
        icon={<Check className="vx-icon" size={16}/>}
        onChange={event => props.onChange(onChange(option))}
        label={option.label}
        disabled={props.disabled}
        required={props.required}
        checked={props.value.indexOf(option.value) !== -1}
      />
    })
  );
};
