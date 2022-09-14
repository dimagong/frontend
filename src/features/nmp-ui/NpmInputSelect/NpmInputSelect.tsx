import "./styles.scss";

import React from "react";
import CSS from "csstype";

import { Select } from "antd";

const { Option } = Select;

export interface IProps {
  handleChange: (value: string) => {};
  options: string[];
  style?: CSS.Properties;
}

const NpmInputSelect: Function = ({ handleChange, options, style = { width: "100%" } }: IProps): JSX.Element => {
  return (
    <>
      <Select
        defaultValue={options.length ? options[0] : "none"}
        // @ts-ignore
        style={style}
        onChange={(value) => handleChange(value)}
      >
        {options.length ? (
          options.map((option, idx) => {
            return (
              <Option key={idx} value={option}>
                {option}
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
