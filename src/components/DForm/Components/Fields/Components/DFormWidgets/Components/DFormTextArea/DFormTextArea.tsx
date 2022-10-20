import React from "react";
import type { FC } from "react";

import { NmpTextArea } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormFieldProps } from "../../types";

type Props = AbstractDFormFieldProps;

export const DFormTextArea: FC<Props> = (props) => {
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
      <NmpTextArea rows={5} disabled={isDisabled} placeholder="Enter your answer here" />
    </DFormItem>
  );
};
