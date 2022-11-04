import "./styles.scss";

import React from "react";
import classnames from "classnames";
import { Select, SelectProps } from "antd";
import type { DefaultOptionType } from "antd/lib/select";

type Props = Omit<SelectProps, "loading" | "showSearch"> & { isLoading?: boolean; isSearchable?: boolean };

const filterOptionForSearchable = (input: string, option?: DefaultOptionType): boolean => {
  if (!option) {
    return false;
  }

  return (option.label ?? option.children ?? "").toString().toLowerCase().includes(input.toLowerCase());
};

export const NmpSelect: React.FC<Props> = (props) => {
  const { options = [], isLoading, children, className, isSearchable = true, filterOption, ...rest } = props;
  const _filterOption = isSearchable && filterOption === undefined ? filterOptionForSearchable : filterOption;

  return (
    <Select
      loading={isLoading}
      showSearch={isSearchable}
      filterOption={_filterOption}
      className={classnames("nmp-select", className)}
      {...rest}
    >
      {children ??
        options?.map((option) => {
          const { label, value } = typeof option === "object" ? option : { label: option, value: option };

          return (
            <Select.Option value={value} key={value}>
              {label}
            </Select.Option>
          );
        })}
    </Select>
  );
};
