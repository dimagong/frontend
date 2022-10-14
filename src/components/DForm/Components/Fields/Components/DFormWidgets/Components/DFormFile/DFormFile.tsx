import React from "react";
import type { FC } from "react";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormFieldProps } from "../../types";

import { DFormUploadFile } from "./DFormUploadFile";

type Props = AbstractDFormFieldProps;

export const DFormFile: FC<Props> = (props) => {
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
      style={style}
      className={className}
    >
      <DFormUploadFile maxCount={1} isRemovable isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />
    </DFormItem>
  );
};
