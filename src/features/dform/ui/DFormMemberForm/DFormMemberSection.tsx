import React from "react";
import type { FC, ReactNode } from "react";

import { DFormSection } from "../DFormSection";
import { DformSectionId } from "../../data/models";
import { DFormMemberBlock } from "./DFormMemberBlock";
import { DFormMemberGroup } from "./DFormMemberGroup";
import { DformSchemaContext } from "../DformSchemaContext";

export type DFormMemberSectionProps = {
  sectionId: DformSectionId;
  children?: ReactNode;
};

export const DFormMemberSection: FC<DFormMemberSectionProps> = (props) => {
  const { sectionId, children } = props;
  const { dformSchema } = DformSchemaContext.useContext();
  const section = dformSchema.getSectionById(sectionId);

  const orderedGroups = section.relatedGroupsIds.map((groupId) => dformSchema.getGroupById(groupId));

  return (
    <DFormSection sectionName={section.name}>
      {orderedGroups.map((group) => (
        <DFormMemberGroup groupId={group.id} key={group.id}>
          {group.relatedBlocksIds.map((blockId) => (
            <DFormMemberBlock blockId={blockId} key={blockId} />
          ))}
        </DFormMemberGroup>
      ))}

      {children}
    </DFormSection>
  );
};
