import React from "react";
import type { FC } from "react";

import { NmpInput } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormFieldProps } from "../../types";

type Props = AbstractDFormFieldProps;

export const DFormNumber: FC<Props> = (props) => {
  const { label, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, style, className } = props;

  return (
    <DFormItem
      name={masterSchemaFieldId}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <NmpInput type="number" disabled={isDisabled} placeholder="Enter your answer here" />
    </DFormItem>
  );
};
