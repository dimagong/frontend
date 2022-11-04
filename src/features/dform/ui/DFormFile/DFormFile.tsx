import React from "react";
import type { FC } from "react";

import type { DFormFiles } from "../../types";
import { DFormUploadFile } from "./DFormUploadFile";

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
