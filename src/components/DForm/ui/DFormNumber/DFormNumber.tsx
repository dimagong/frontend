import React from "react";
import type { FC, ChangeEventHandler } from "react";

import { NmpInput } from "features/nmp-ui";

export type DFormNumberProps = {
  value?: string | number;
  isDisabled: boolean;
  onChange?: ChangeEventHandler;
};

export const DFormNumber: FC<DFormNumberProps> = (props) => {
  const { value, isDisabled, onChange } = props;

  return (
    <NmpInput
      type="number"
      value={value}
      disabled={isDisabled}
      placeholder="Enter your answer here"
      onChange={onChange}
    />
  );
};
