import React from "react";
import type { FC } from "react";

import { DFormUploadFile } from "../DFormFile/DFormUploadFile";
import type { DFormFiles } from "../../types/dformFiles";

export type DFormFileListProps = {
  id?: string;
  value?: DFormFiles;
  isDisabled?: boolean;
  masterSchemaFieldId?: number;
  onChange?: (files: DFormFiles) => void;
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
