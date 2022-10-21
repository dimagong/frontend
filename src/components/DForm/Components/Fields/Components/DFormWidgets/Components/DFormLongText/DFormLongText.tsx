import React from "react";
import type { FC } from "react";
import classnames from "classnames";

import { NmpLongText } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormStringLikeFieldProps } from "../../types";

type Props = AbstractDFormStringLikeFieldProps;

export const DFormLongText: FC<Props> = (props) => {
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
      rules={[
        {
          min: minLength,
          max: maxLength,
          // transform: (value) => {
          //   if (typeof value === "string") {
          //     const plain = value.replace(/<[^>]*>/g, "");
          //     return plain.endsWith("\n") ? plain.slice(0, plain.length - 1) : plain;
          //   }
          //   return value;
          // },
        },
      ]}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={classnames(className, "mb-0")}
    >
      <NmpLongText isDisabled={isDisabled} />
    </DFormItem>
  );
};
