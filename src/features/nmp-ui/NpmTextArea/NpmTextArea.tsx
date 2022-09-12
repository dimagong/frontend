import "./styles.scss";

import { Input } from "antd";
import React from "react";

const { TextArea } = Input;

interface IProps {
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  size?: "middle" | "small" | "large";
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  rows?: number;
  style?: object;
}

const NpmTextArea = (props: IProps) => {
  return <TextArea {...props} showCount />;
};

export default NpmTextArea;
