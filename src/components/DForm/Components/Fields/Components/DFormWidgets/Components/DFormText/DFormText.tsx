import React from "react";
import type { FC } from "react";

import { NmpInput } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import { AbstractDFormFieldProps } from "../../types";

const placeholder = "Enter your answer here";

type Props = AbstractDFormFieldProps;

export const DFormText: FC<Props> = (props) => {
  const {
    label,
    isRequired = false,
    isDisabled = false,
    isLabelShowing = true,
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
      style={style}
      className={className}
    >
      <NmpInput type="text" disabled={isDisabled} placeholder={placeholder} />
    </DFormItem>
  );
};
