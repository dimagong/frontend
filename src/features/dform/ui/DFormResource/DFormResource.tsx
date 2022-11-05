import React from "react";
import type { FC } from "react";

import type { DFormFile } from "../../types";
import { DFormResourceItem } from "./DFormResourceItem";

export type DFormResourceProps = {
  value?: DFormFile;
  isDisabled?: boolean;
  masterSchemaFieldId?: number;
};

export const DFormResource: FC<DFormResourceProps> = (props) => {
  const { value, isDisabled, masterSchemaFieldId } = props;

  return <DFormResourceItem value={value} isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />;
};
