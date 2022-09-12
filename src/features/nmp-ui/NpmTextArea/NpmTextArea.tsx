import "./styles.scss";

import { Input } from "antd";
import React from "react";

const { TextArea } = Input;

interface IProps {
  maxLength: number;
  placeholder: string;
  defaultValue: string;
  value: string | number | readonly string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  size: "middle" | "small" | "large";
  addonAfter: React.ReactNode;
  addonBefore: React.ReactNode;
  rows: number;
  style: object;
}

const onChangeDefault = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  console.log("Change:", e.target.value);
};

const NpmTextArea = ({
  maxLength = 200,
  onChange = onChangeDefault,
  size = "middle",
  rows = 6,
  defaultValue = "",
  value = "",
  addonAfter = false,
  addonBefore = false,
  style = { height: 120 },
}: IProps) => {
  return (
    <TextArea
      showCount
      style={style}
      onChange={onChange}
      rows={rows}
      size={size}
      maxLength={maxLength}
      defaultValue={defaultValue}
      value={value}
    />
  );
};

export default NpmTextArea;
