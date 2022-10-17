import React, { FC } from "react";

import { NmpCheckbox } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import { DFormLabel } from "../DFormLabel";
import { AbstractDFormFieldProps } from "../../types";

type Props = AbstractDFormFieldProps;

export const DFormBoolean: FC<Props> = (props) => {
  const {
    label,
    isRequired = false,
    isDisabled = false,
    isLabelShowing = false,
    masterSchemaFieldId,
    style,
    className,
  } = props;

  return (
    <DFormItem
      name={masterSchemaFieldId}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      valuePropName="checked"
      style={style}
      className={className}
    >
      <NmpCheckbox disabled={isDisabled}>
        <DFormLabel label={label} isSmall />
      </NmpCheckbox>
    </DFormItem>
  );
};
