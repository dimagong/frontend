import React from "react";
import type { FC } from "react";

import { NpmDatePicker, NpmTimePicker } from "features/nmp-ui";
import { DateWidgetFormatTypes } from "features/applications/constants";

const getPicker = (format: DateWidgetFormatTypes) => {
  switch (format) {
    case DateWidgetFormatTypes.Time:
      return NpmTimePicker;
    case DateWidgetFormatTypes.Date:
      return NpmDatePicker;
    default:
      throw new Error(`Unexpected: The date format "${format}" is not supported.`);
  }
};

export type DFormDatePickerProps = {
  id?: string;
  value?: string;
  format?: DateWidgetFormatTypes;
  isDisabled?: boolean;
  onChange?: (iso: string) => void;
};

export const DFormDatePicker: FC<DFormDatePickerProps> = (props) => {
  const { id, value, format = DateWidgetFormatTypes.Date, isDisabled, onChange } = props;

  const Picker = getPicker(format);

  return <Picker id={id} value={value} disabled={isDisabled} onChange={onChange} />;
};
