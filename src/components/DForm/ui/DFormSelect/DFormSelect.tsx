import React from "react";
import type { FC } from "react";

import { NmpSelect } from "features/nmp-ui";

export type DFormSelectProps = {
  value?: string;
  options?: Array<string>;
  isDisabled: boolean;
  onChange?: (value: string) => void;
};

export const DFormSelect: FC<DFormSelectProps> = (props) => {
  const { value, options = [], isDisabled, onChange } = props;

  return (
    <NmpSelect
      value={value}
      options={options.map((option) => ({ label: option, value: option }))}
      disabled={isDisabled}
      placeholder="Select an option"
      onChange={onChange}
    />
  );
};
