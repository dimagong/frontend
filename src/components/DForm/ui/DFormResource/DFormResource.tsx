import React from "react";
import type { FC } from "react";

import { DFormFile } from "../../types/dformFile";
import { DFormResourceItem } from "./DFormResourceItem";
import { DFormLabeledItem } from "../DFormLabeledItem";

export type DFormResourceProps = {
  label?: string;
  value?: DFormFile;
  isDisabled?: boolean;
  isLabelShowing?: boolean;
  masterSchemaFieldId?: number;
};

export const DFormResource: FC<DFormResourceProps> = (props) => {
  const { label, value, isDisabled, isLabelShowing, masterSchemaFieldId } = props;

  return (
    <DFormLabeledItem label={label} isRequired={false} isLabelShowing={isLabelShowing}>
      <DFormResourceItem value={value} isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />
    </DFormLabeledItem>
  );
};
