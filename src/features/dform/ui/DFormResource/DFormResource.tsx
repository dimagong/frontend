import React from "react";
import type { FC } from "react";

import type { DFormFile } from "../../types";
import { DFormLabeledBlock } from "../DFormLabeledBlock";
import { DFormResourceItem } from "./DFormResourceItem";

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
    <DFormLabeledBlock label={label} isRequired={false} isLabelShowing={isLabelShowing}>
      <DFormResourceItem value={value} isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />
    </DFormLabeledBlock>
  );
};
