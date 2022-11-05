import React from "react";
import type { FC } from "react";

import { unreachable } from "features/common";
import { NpmDatePicker, NpmTimePicker } from "features/nmp-ui";

import { DFormDateFormatTypes } from "../../types";

const getPicker = (format: DFormDateFormatTypes) => {
  switch (format) {
    case DFormDateFormatTypes.Time:
      return NpmTimePicker;
    case DFormDateFormatTypes.Date:
      return NpmDatePicker;
    default:
      unreachable(`DForm date format "${format}" is not supported.`);
  }
};

export type DFormDatePickerProps = {
  id?: string;
  value?: string;
  format?: DFormDateFormatTypes;
  isDisabled?: boolean;
  placeholder?: string;
  onChange?: (iso: string) => void;
};

export const DFormDatePicker: FC<DFormDatePickerProps> = (props) => {
  const { id, value, format = DFormDateFormatTypes.Date, isDisabled, placeholder, onChange } = props;

  const Picker = getPicker(format);

  return <Picker id={id} value={value} disabled={isDisabled} placeholder={placeholder} onChange={onChange} />;
};
