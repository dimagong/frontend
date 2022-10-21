import React from "react";
import type { FC } from "react";

import type { AbstractDFormFieldProps } from "../../types";

import { DFormItem } from "../DFormItem";
import { DFormUploadFile } from "../DFormFile/DFormUploadFile";

type Props = AbstractDFormFieldProps;

export const DFormFileList: FC<Props> = (props) => {
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
      <DFormUploadFile isMultiple isRemovable isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />
    </DFormItem>
  );
};
