import "./styles.scss";

import React from "react";

import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

interface IProps {
  onChange?: (e: CheckboxChangeEvent) => any;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
}

const NpmCheckbox = ({ onChange, checked, disabled, label }: IProps) => {
  return (
    <Checkbox checked={checked} disabled={disabled} onChange={onChange}>
      {label}
    </Checkbox>
  );
};

export default NpmCheckbox;
