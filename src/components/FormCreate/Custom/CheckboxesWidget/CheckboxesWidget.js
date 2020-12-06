import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import {Check} from "react-feather";
import React from "react";
import rfdc from "rfdc";

import FieldLabel from '../FieldLabel'

import './styles.scss'

const clone = rfdc();

export const CustomCheckbox = ({
  className,
  icon,
  label,
  checked,
  value,
  disabled,
  onClick,
  onChange,
  defaultChecked
}) => {

  return (
    <div
      className={`custom-checkbox-container ${className ? className : ""}`}
    >
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        checked={checked}
        value={value}
        disabled={disabled}
        onClick={onClick ? onClick : null}
        onChange={onChange ? onChange : null}
        id={label}
      />

      <span className="custom-checkbox_check">
        <span className="custom-checkbox_check-icon">
          {icon}
        </span>
      </span>

      <label htmlFor={label} className="custom-checkbox_label">
        {label}
      </label>
    </div>
  )
}

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
    <div>
      <FieldLabel label={props.schema.title} />
      {props.options.enumOptions.map((option, key) => {
        return (
          <CustomCheckbox
            color="primary"
            icon={<Check className="vx-icon" size={16}/>}
            onChange={event => props.onChange(onChange(option))}
            label={option.label}
            disabled={props.disabled}
            required={props.required}
            checked={props.value.indexOf(option.value) !== -1}
            className={"multiselect-checkboxes"}
          />
        )
      })}
    </div>
  );
};
