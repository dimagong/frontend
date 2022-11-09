import React from "react";
import type { FC } from "react";

import { DFormAddElement } from "../DFormAddElement";
import { DFormEditableGroup } from "./DFormEditableGroup";
import { DFormEditableBlock } from "./DFormEditableBlock";
import { DformSchemaContext } from "../DformSchemaContext";
import { DFormEditableSection } from "./DFormEditableSection";
import { DformBlockId, DformElementTypes, DformGroupId, DformSectionId } from "../../data/models";

export type DFormTemplateSectionEditorProps = {
  sectionId: DformSectionId;
  isDraggable?: boolean;
  selectedElementId?: string;
  onBlockClick?: (blockId: DformBlockId) => void;
  onGroupClick?: (groupId: DformGroupId) => void;
  onBlockCreate?: (groupId: DformGroupId, blockId?: DformBlockId) => void;
  onGroupCreate?: (sectionId: DformSectionId) => void;
};

export const DFormTemplateSectionEditor: FC<DFormTemplateSectionEditorProps> = (props) => {
  const { sectionId, isDraggable, selectedElementId, onBlockClick, onGroupClick, onBlockCreate, onGroupCreate } = props;

  const { dformSchema } = DformSchemaContext.useContext();
  const section = dformSchema.getSectionById(sectionId);

  const orderedGroups = section.relatedGroupsIds.map((groupId) => dformSchema.getGroupById(groupId));

  const onAddElementClick = () => {
    if (onGroupCreate) {
      onGroupCreate(sectionId);
    }
  };

  return (
    <DFormEditableSection sectionId={sectionId} sectionName={section.name} isDraggable={isDraggable}>
      {orderedGroups.map((group, index) => (
        <DFormEditableGroup
          groupId={group.id}
          groupIndex={index}
          isSelected={selectedElementId === group.id}
          isDraggable={isDraggable}
          onGroupClick={onGroupClick}
          onBlockCreate={onBlockCreate}
          key={group.id}
        >
          {group.relatedBlocksIds
            .map((blockId) => dformSchema.getBlockById(blockId))
            .map((block, index) => (
              <DFormEditableBlock
                blockId={block.id}
                groupId={group.id}
                blockIndex={index}
                blockSize={block.blockSize}
                isSelected={selectedElementId === block.id}
                isDraggable={isDraggable}
                onBlockClick={onBlockClick}
                onBlockCreate={onBlockCreate}
                key={block.id}
              />
            ))}
        </DFormEditableGroup>
      ))}

      <DFormAddElement elementType={DformElementTypes.Group} onClick={onAddElementClick} />
    </DFormEditableSection>
  );
};
