import React from "react";
import type { FC } from "react";

import { NmpLongText } from "features/nmp-ui";

export type DFormLongTextProps = {
  value?: string;
  isDisabled: boolean;
  onChange?: (value: string) => void;
};

export const DFormLongText: FC<DFormLongTextProps> = (props) => {
  const { value, isDisabled, onChange } = props;

  return <NmpLongText value={value} isDisabled={isDisabled} onChange={onChange} />;
};
