import React from "react";
import type { FC } from "react";

import { NmpLongText } from "features/nmp-ui";

export type DFormLongTextProps = {
  id?: string;
  value?: string;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
};

export const DFormLongText: FC<DFormLongTextProps> = (props) => {
  const { id, value, isDisabled, onChange } = props;

  return <NmpLongText id={id} value={value} isDisabled={isDisabled} onChange={onChange} />;
};
