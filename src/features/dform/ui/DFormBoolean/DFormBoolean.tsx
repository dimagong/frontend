import React from "react";
import type { FC } from "react";

import { NmpCheckbox } from "features/nmp-ui";

import { DFormLabel } from "../DFormLabel";

export type DFormBooleanProps = {
  id?: string;
  label?: string;
  value?: boolean;
  isDisabled?: boolean;
  onChange?: (value: boolean) => void;
};

export const DFormBoolean: FC<DFormBooleanProps> = (props) => {
  const { id, label, value, isDisabled, onChange } = props;

  const onCheckboxChange = (checked: boolean) => {
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <NmpCheckbox
      id={id}
      checked={value}
      disabled={isDisabled}
      onChange={({ target }) => onCheckboxChange(target.checked)}
    >
      <DFormLabel label={label} isSmall />
    </NmpCheckbox>
  );
};
