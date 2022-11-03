import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { Checkbox, CheckboxProps } from "antd";

import { NmpCheckboxGroup } from "./NmpCheckboxGroup";

export type NmpCheckboxProps = CheckboxProps;

type _FC = FC<NmpCheckboxProps> & { Group: typeof NmpCheckboxGroup };

export const NmpCheckbox: _FC = (props) => {
  return <Checkbox {...props} />;
};

NmpCheckbox.Group = NmpCheckboxGroup;
