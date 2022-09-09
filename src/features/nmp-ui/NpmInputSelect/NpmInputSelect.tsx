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
        style={style}
        onChange={(value) => handleChange(value)}
      >
        {options.length ? (
          options.map((option) => {
            return <Option value={option}>{option}</Option>;
          })
        ) : (
          <Option value="none">none</Option>
        )}
      </Select>
    </>
  );
};

export default NpmInputSelect;
