import React from "react";
import type { FC, ReactNode } from "react";

import { DFormBaseGroup } from "./DFormBaseGroup";

type Props = {
  groupId: string;
  groupName?: string;
  children?: ReactNode;
};

export const DFormGroup: FC<Props> = (props) => {
  const { groupName, children } = props;

  return <DFormBaseGroup groupName={groupName}>{children}</DFormBaseGroup>;
};
