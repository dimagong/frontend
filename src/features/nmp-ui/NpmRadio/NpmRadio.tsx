import "./styles.scss";

import React from "react";

import { Radio } from "antd";

interface IProps {
  value: string | number;
  content: string | number;
  style?: object;
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
}

const NpmRadio = ({
  value,
  content,
  style = {},
  className = "",
  checked = false,
  defaultChecked = false,
}: IProps): JSX.Element => (
  <Radio style={style} value={value} className={className} checked={checked} defaultChecked={defaultChecked}>
    {content}
  </Radio>
);

export default NpmRadio;
