import React from "react";
import type { FC } from "react";

import { NmpTextArea } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormStringLikeFieldProps } from "../../types";

type Props = AbstractDFormStringLikeFieldProps;

export const DFormTextArea: FC<Props> = (props) => {
  const {
    label,
    minLength,
    maxLength,
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
      rules={[{ min: minLength, max: maxLength }]}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <NmpTextArea rows={5} disabled={isDisabled} placeholder="Enter your answer here" />
    </DFormItem>
  );
};
