import React from "react";
import type { FC } from "react";

import { DFormUploadFile } from "./DFormUploadFile";
import type { DformFileListValueType } from "../../data/models";

export type DFormFileProps = {
  id?: string;
  value?: DformFileListValueType;
  isDisabled?: boolean;
  masterSchemaFieldId?: number;
  onChange?: (files: DformFileListValueType) => void;
};

export const DFormFile: FC<DFormFileProps> = (props) => {
  const { id, value, isDisabled, masterSchemaFieldId, onChange } = props;

  return (
    <DFormUploadFile
      id={id}
      value={value}
      isDisabled={isDisabled}
      isRemovable
      masterSchemaFieldId={masterSchemaFieldId}
      onChange={onChange}
    />
  );
};
