import React from "react";
import type { FC } from "react";

import { DFormResourceItem } from "./DFormResourceItem";
import { DFormLabeledItem } from "../DFormLabeledItem";

export type DFormResourceProps = {
  label?: string;
  isDisabled: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId?: number;
};

export const DFormResource: FC<DFormResourceProps> = (props) => {
  const { label, isDisabled, isLabelShowing, masterSchemaFieldId } = props;

  return (
    <DFormLabeledItem label={label} isRequired={false} isLabelShowing={isLabelShowing}>
      <DFormResourceItem isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />
    </DFormLabeledItem>
  );
};
