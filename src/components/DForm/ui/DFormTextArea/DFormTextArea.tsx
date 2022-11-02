import React from "react";
import type { FC, ChangeEventHandler } from "react";

import { NmpTextArea } from "features/nmp-ui";

export type DFormTextAreaProps = {
  id?: string;
  value?: string;
  isDisabled?: boolean;
  onChange?: ChangeEventHandler;
};

export const DFormTextArea: FC<DFormTextAreaProps> = (props) => {
  const { id, value, isDisabled, onChange } = props;

  return (
    <NmpTextArea
      id={id}
      rows={5}
      value={value}
      disabled={isDisabled}
      placeholder="Enter your answer here"
      onChange={onChange}
    />
  );
};
