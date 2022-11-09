import React from "react";
import type { FC } from "react";

import { DFormUploadFile } from "../DFormFile/DFormUploadFile";
import type { DformFileListValueType } from "../../data/models";

export type DFormFileListProps = {
  id?: string;
  value?: DformFileListValueType;
  isDisabled?: boolean;
  masterSchemaFieldId?: number;
  onChange?: (files: DformFileListValueType) => void;
};

export const DFormFileList: FC<DFormFileListProps> = (props) => {
  const { id, value, isDisabled, masterSchemaFieldId, onChange } = props;

  return (
    <DFormUploadFile
      id={id}
      value={value}
      isMultiple
      isDisabled={isDisabled}
      isRemovable
      masterSchemaFieldId={masterSchemaFieldId}
      onChange={onChange}
    />
  );
};
