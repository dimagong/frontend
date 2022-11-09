import React from "react";
import type { FC } from "react";

import { DFormResourceItem } from "./DFormResourceItem";
import type { DformFileValueType } from "../../data/models";

export type DFormResourceProps = {
  value?: DformFileValueType;
  isDisabled?: boolean;
  masterSchemaFieldId?: number;
};

export const DFormResource: FC<DFormResourceProps> = (props) => {
  const { value, isDisabled, masterSchemaFieldId } = props;

  return <DFormResourceItem value={value} isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />;
};
