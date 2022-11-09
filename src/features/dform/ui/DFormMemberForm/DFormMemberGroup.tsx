import React from "react";
import type { FC, ReactNode } from "react";

import { DFormGroup } from "../DFormGroup";
import { DformGroupId } from "../../data/models";
import { DformSchemaContext } from "../DformSchemaContext";

export type DFormMemberGroupProps = {
  groupId: DformGroupId;
  children?: ReactNode;
};

export const DFormMemberGroup: FC<DFormMemberGroupProps> = (props) => {
  const { groupId, children } = props;
  const { dformSchema } = DformSchemaContext.useContext();
  const group = dformSchema.getGroupById(groupId);

  return (
    <DFormGroup groupName={group.name} key={group.id}>
      {children}
    </DFormGroup>
  );
};
