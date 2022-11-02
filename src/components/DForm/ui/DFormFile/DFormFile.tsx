import React from "react";
import type { FC } from "react";

import { DFormUploadFile } from "./DFormUploadFile";
import type { DFormFiles } from "../../types/dformFiles";

export type DFormFileProps = {
  id?: string;
  value?: DFormFiles;
  isDisabled?: boolean;
  masterSchemaFieldId?: number;
  onChange?: (files: DFormFiles) => void;
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
