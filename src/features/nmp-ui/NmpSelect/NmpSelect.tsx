import "./styles.scss";

import React from "react";
import classnames from "classnames";
import { Select, SelectProps } from "antd";

type Props = Omit<SelectProps, "loading" | "showSearch"> & { isLoading?: boolean; isSearchable?: boolean };

export const NmpSelect: React.FC<Props> = (props) => {
  const { options = [], isLoading, children, className, isSearchable = true, ...rest } = props;

  return (
    <Select
      loading={isLoading}
      showSearch={isSearchable}
      filterOption={(input, option) => {
        return (option?.label ?? option?.children ?? "").toString().toLowerCase().includes(input.toLowerCase());
      }}
      className={classnames("nmp-select", className)}
      {...rest}
    >
      {children ??
        options?.map(({ label, value }) => (
          <Select.Option value={value} key={value}>
            {label}
          </Select.Option>
        ))}
    </Select>
  );
};
