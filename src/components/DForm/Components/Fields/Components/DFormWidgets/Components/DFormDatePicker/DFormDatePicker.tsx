import React from "react";
import type { FC } from "react";

import { NpmDatePicker, NpmTimePicker } from "features/nmp-ui";
import { DateWidgetFormatTypes } from "features/Applications/constants";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormFieldProps } from "../../types";

const getPicker = (dateType) => {
  switch (dateType) {
    case DateWidgetFormatTypes.Time:
      return NpmTimePicker;
    case DateWidgetFormatTypes.Date:
      return NpmDatePicker;
    default:
      throw new Error(`Unsupported date type: '${dateType}'`);
  }
};

type Props = AbstractDFormFieldProps & {
  format: DateWidgetFormatTypes;
};

export const DFormDatePicker: FC<Props> = (props) => {
  const {
    label,
    format,
    isRequired = false,
    isDisabled = false,
    isLabelShowing = false,
    masterSchemaFieldId,
    style,
    className,
  } = props;

  const Picker = getPicker(format);

  return (
    <DFormItem
      name={masterSchemaFieldId}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <Picker disabled={isDisabled} />
    </DFormItem>
  );
};
