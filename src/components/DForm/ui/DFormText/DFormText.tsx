import React from "react";
import type { FC, ChangeEventHandler } from "react";

import { NmpInput } from "features/nmp-ui";

export type DFormTextProps = {
  id?: string;
  value?: string;
  isDisabled?: boolean;
  onChange?: ChangeEventHandler;
};

export const DFormText: FC<DFormTextProps> = (props) => {
  const { id, value, isDisabled, onChange } = props;

  return (
    <NmpInput
      id={id}
      type="text"
      value={value}
      disabled={isDisabled}
      placeholder="Enter your answer here"
      onChange={onChange}
    />
  );
};
