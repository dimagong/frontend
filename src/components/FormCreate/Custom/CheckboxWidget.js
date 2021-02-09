import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import {Check} from "react-feather";
import React from "react";
import {CustomCheckbox} from './CheckboxesWidget/CheckboxesWidget'
import FieldLabel from './FieldLabel'

export function CheckboxWidget(props) {
  const onChange = (event) => {
    return props.onChange(event.target.checked);
  };


  return (
    <div>
      {props.options.label !== false ? <FieldLabel label={props.label} required={props.required} />  : null}
      <div style={{
        marginBottom: "20px",
        marginLeft: "30px",
      }}>
        <CustomCheckbox
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
    </div>
  );
};
