import "./styles.scss";

import { Input } from "antd";
import React from "react";
import { AnyCnameRecord } from "dns";

const { TextArea } = Input;

interface IProps {
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => any;
  size?: "middle" | "small" | "large";
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  rows?: number;
  style?: object;
  disabled?: boolean;
  className?: string;
}

const NpmTextArea = (props: IProps) => {
  return <TextArea {...props} showCount />;
};

export default NpmTextArea;
