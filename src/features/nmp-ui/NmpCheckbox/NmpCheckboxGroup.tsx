import React from "react";
import { Checkbox } from "antd";
import { CheckboxGroupProps } from "antd/lib/checkbox/Group";

export const NmpCheckboxGroup: React.FC<CheckboxGroupProps> = (props) => {
  return <Checkbox.Group {...props} />;
};
