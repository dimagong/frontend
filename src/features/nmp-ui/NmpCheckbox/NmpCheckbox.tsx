import "./styles.scss";

import React from "react";
import { Checkbox, CheckboxProps } from "antd";

import { NmpCheckboxGroup } from "./NmpCheckboxGroup";

type FC = React.FC<CheckboxProps> & { Group: typeof NmpCheckboxGroup };

export const NmpCheckbox: FC = (props) => {
  return <Checkbox {...props} />;
};

NmpCheckbox.Group = NmpCheckboxGroup;
