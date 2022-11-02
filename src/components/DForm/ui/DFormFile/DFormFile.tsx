import React from "react";
import type { FC } from "react";

import { DFormUploadFile } from "./DFormUploadFile";
import type { DFormFiles } from "../../types/dformFiles";

export type DFormFileProps = {
  value?: DFormFiles;
  isDisabled: boolean;
  masterSchemaFieldId?: number;
  onChange?: (files: DFormFiles) => void;
};

export const DFormFile: FC<DFormFileProps> = (props) => {
  const { value, isDisabled, masterSchemaFieldId, onChange } = props;

  return (
    <DFormUploadFile
      value={value}
      isDisabled={isDisabled}
      isRemovable
      masterSchemaFieldId={masterSchemaFieldId}
      onChange={onChange}
    />
  );
};
