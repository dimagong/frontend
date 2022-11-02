import React from "react";
import type { FC } from "react";

import { NmpCheckbox, NmpCheckboxProps } from "features/nmp-ui";

import { DFormLabel } from "../DFormLabel";

export type DFormBooleanProps = {
  id?: string;
  label?: string;
  checked?: NmpCheckboxProps["checked"];
  isDisabled: boolean;
  onChange?: NmpCheckboxProps["onChange"];
};

export const DFormBoolean: FC<DFormBooleanProps> = (props) => {
  const { id, label, checked, isDisabled, onChange } = props;

  return (
    <NmpCheckbox id={id} disabled={isDisabled} onChange={onChange} checked={checked}>
      <DFormLabel label={label} isSmall />
    </NmpCheckbox>
  );
};
