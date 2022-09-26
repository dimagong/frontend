import "./styles.scss";

import React from "react";
import CSS from "csstype";

import { Select } from "antd";

const { Option } = Select;

export interface IProps {
  onChange: Function;
  options: string[] | { label: string; value: string }[];
  style?: CSS.Properties;
  value?: string | string[] | number | number[];
  disabled?: boolean;
  placeholder?: string | string[] | number | number[];
  className?: string;
  status?: "error" | "warning" | "";
}

const NpmInputSelect: Function = ({ onChange, options, style = { width: "100%" }, ...props }: IProps): JSX.Element => {
  return (
    <>
      <Select
        // @ts-ignore
        style={style}
        onChange={(value) => {
          console.log("onChange value", value);
          onChange(options[`${value}`]);
        }}
        {...props}
      >
        {options.length ? (
          options.map((option, idx) => {
            return (
              <Option key={idx} value={option.lable}>
                {option.value}
              </Option>
            );
          })
        ) : (
          <Option value="none">none</Option>
        )}
      </Select>
    </>
  );
};

export default NpmInputSelect;
