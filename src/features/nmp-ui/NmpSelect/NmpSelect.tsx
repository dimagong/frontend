import "./styles.scss";

import React from "react";

import { Select, SelectProps } from "antd";

const { Option } = Select;

type Props = SelectProps;

export const NmpSelect: React.FC<Props> = ({ options = [], children, ...props }) => {
  return (
    <Select {...props}>
      {options.length === 0 ? (
        <Option value="none">none</Option>
      ) : (
        options.map((option) => (
          <Option value={option.value} key={option.value}>
            {option.label}
          </Option>
        ))
      )}
    </Select>
  );
};
