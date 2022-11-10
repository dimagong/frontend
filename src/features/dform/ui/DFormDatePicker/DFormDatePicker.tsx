import React from "react";
import type { FC } from "react";

import { unreachable } from "features/common";
import { NpmDatePicker, NpmTimePicker } from "features/nmp-ui";

import { DformDateFormatTypes } from "../../data/models";

const getPicker = (format: DformDateFormatTypes) => {
  switch (format) {
    case DformDateFormatTypes.Time:
      return NpmTimePicker;
    case DformDateFormatTypes.Date:
      return NpmDatePicker;
    default:
      unreachable(`DForm date format "${format}" is not supported.`);
  }
};

export type DFormDatePickerProps = {
  id?: string;
  value?: string;
  format?: DformDateFormatTypes;
  isDisabled?: boolean;
  placeholder?: string;
  onChange?: (iso: string) => void;
};

export const DFormDatePicker: FC<DFormDatePickerProps> = (props) => {
  const { id, value, format = DformDateFormatTypes.Date, isDisabled, placeholder, onChange } = props;

  const Picker = getPicker(format);

  return <Picker id={id} value={value} disabled={isDisabled} placeholder={placeholder} onChange={onChange} />;
};
