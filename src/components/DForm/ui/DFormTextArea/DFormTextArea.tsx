import React from "react";
import type { FC, ChangeEventHandler } from "react";

import { NmpTextArea } from "features/nmp-ui";

export type DFormTextAreaProps = {
  value?: string;
  isDisabled: boolean;
  onChange?: ChangeEventHandler;
};

export const DFormTextArea: FC<DFormTextAreaProps> = (props) => {
  const { value, isDisabled, onChange } = props;

  return (
    <NmpTextArea
      rows={5}
      value={value}
      disabled={isDisabled}
      placeholder="Enter your answer here"
      onChange={onChange}
    />
  );
};
