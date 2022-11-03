import React from "react";
import type { FC } from "react";

import { NpmDatePicker, NpmTimePicker } from "features/nmp-ui";
import { DateWidgetFormatTypes } from "features/Applications/constants";

const getPicker = (dateFormat: DateWidgetFormatTypes) => {
  switch (dateFormat) {
    case DateWidgetFormatTypes.Time:
      return NpmTimePicker;
    case DateWidgetFormatTypes.Date:
      return NpmDatePicker;
    default:
      throw new Error(`Unexpected: The date format "${dateFormat}" is not supported.`);
  }
};

export type DFormDatePickerProps = {
  id?: string;
  value?: string;
  dateFormat?: DateWidgetFormatTypes;
  isDisabled?: boolean;
  onChange?: (iso: string) => void;
};

export const DFormDatePicker: FC<DFormDatePickerProps> = (props) => {
  const { id, value, dateFormat = DateWidgetFormatTypes.Date, isDisabled, onChange } = props;

  const Picker = getPicker(dateFormat);

  return <Picker id={id} value={value} disabled={isDisabled} onChange={onChange} />;
};
