import React from "react";
import type { FC, ChangeEventHandler } from "react";

import { NmpInput } from "features/nmp-ui";

export type DFormNumberProps = {
  id?: string;
  value?: string | number;
  isDisabled?: boolean;
  onChange?: ChangeEventHandler;
};

export const DFormNumber: FC<DFormNumberProps> = (props) => {
  const { id, value, isDisabled, onChange } = props;

  return (
    <NmpInput
      id={id}
      type="number"
      value={value}
      disabled={isDisabled}
      placeholder="Enter your answer here"
      onChange={onChange}
    />
  );
};
