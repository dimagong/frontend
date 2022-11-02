import React, { ReactNode } from "react";
import type { FC } from "react";

import { DFormBaseGroup } from "./DFormBaseGroup";

type Props = {
  groupId: string;
  groupName?: string;
  // relatedBlocks: Array<string>;
  // isDFormAccessible: boolean;
  children?: ReactNode;
};

export const DFormGroup: FC<Props> = (props) => {
  // ToDo: use isDFormAccessible to Field as isDisabled
  const { groupId, groupName, /*relatedBlocks, isDFormAccessible,*/ children } = props;

  return <DFormBaseGroup groupName={groupName}>{children}</DFormBaseGroup>;
};
