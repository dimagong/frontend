import "./styles.scss";

import React from "react";
import classnames from "classnames";
import { Select, SelectProps } from "antd";

type Props = SelectProps;

export const NmpSelect: React.FC<Props> = ({ options = [], children, className, ...props }) => {
  return (
    <Select className={classnames("nmp-select", className)} {...props}>
      {children ??
        options?.map(({ label, value }) => (
          <Select.Option value={value} key={value}>
            {label}
          </Select.Option>
        ))}
    </Select>
  );
};
