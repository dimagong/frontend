import "./styles.scss";

import React from "react";

import { Checkbox, CheckboxProps } from "antd";

type Props = {
  label?: React.ReactNode;
} & CheckboxProps;

const NpmCheckbox: React.FC<Props> = ({ label, ...props }) => {
  return <Checkbox {...props}>{label}</Checkbox>;
};

export default NpmCheckbox;
