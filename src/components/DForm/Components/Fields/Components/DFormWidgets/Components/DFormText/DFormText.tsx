import React from "react";
import type { FC } from "react";

import { NmpInput } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormStringLikeFieldProps } from "../../types";

const placeholder = "Enter your answer here";

type Props = AbstractDFormStringLikeFieldProps;

export const DFormText: FC<Props> = (props) => {
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
      <NmpInput type="text" disabled={isDisabled} placeholder={placeholder} />
    </DFormItem>
  );
};
