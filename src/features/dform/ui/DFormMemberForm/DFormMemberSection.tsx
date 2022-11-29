import React from "react";
import type { FC, ReactNode } from "react";
import { useQuery, useQueryClient } from "react-query";

import { DCRElement } from "../DCR";
import { DFormContext } from "../DFormContext";
import { DFormSection } from "../DFormSection";
import { DformSectionId } from "../../data/models";
import { DFormMemberBlock } from "./DFormMemberBlock";
import { DFormMemberGroup } from "./DFormMemberGroup";
import { DformSchemaContext } from "../DformSchemaContext";
import { MemberDFormService } from "../../data/services/memberDformService";

export type DFormMemberSectionProps = {
  sectionId: DformSectionId;
  children?: ReactNode;
};

export const DFormMemberSection: FC<DFormMemberSectionProps> = (props) => {
  const { sectionId, children } = props;
  const queryClient = useQueryClient();

  const { dformId } = DFormContext.useContext();
  const { dformSchema } = DformSchemaContext.useContext();
  const section = dformSchema.getSectionById(sectionId);

  const orderedGroups = section.relatedGroupsIds.map((groupId) => dformSchema.getGroupById(groupId));

  useQuery({
    queryFn: () => MemberDFormService.instance.viewSections({ dformId, viewedSections: [section.id] }),
    enabled: !section.isViewed,
    queryKey: ["mva-dform-section-viewed", dformId, section.id],
    onSuccess: () => queryClient.invalidateQueries(MemberDFormService.queryKeys.byId(dformId)),
  });

  return (
    <DFormSection sectionName={section.name}>
      {orderedGroups.map((group) => (
        <DCRElement conditions={group.conditions} key={group.id}>
          {({ isDisabled }) => (
            <DFormMemberGroup groupId={group.id}>
              {group.relatedBlocksIds.map((blockId) => (
                <DFormMemberBlock blockId={blockId} isDisabled={isDisabled} key={blockId} />
              ))}
            </DFormMemberGroup>
          )}
        </DCRElement>
      ))}

      {children}
    </DFormSection>
  );
};
