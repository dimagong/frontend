import React from "react";
import type { FC } from "react";

import { NmpCol } from "features/nmp-ui";

import { DFormElementTypes } from "../../types";
import { DFormAddElement } from "../DFormAddElement";
import { DFormEditableGroup } from "./DFormEditableGroup";
import { DFormEditableBlock } from "./DFormEditableBlock";
import { DFormEditableSection } from "./DFormEditableSection";

export type DFormTemplateEditorProps = {
  blocks: any[];
  groups: any[];
  sectionId: string;
  sectionName: string;
  isDraggable?: boolean;
  relatedGroups: string[];
  selectedElementId?: string;
  onBlockClick?: (blockId: string) => void;
  onGroupClick?: (groupId: string) => void;
  onBlockCreate?: (groupId: string, blockId?: string) => void;
  onGroupCreate?: (sectionId: string) => void;
};

export const DFormTemplateSectionEditor: FC<DFormTemplateEditorProps> = (props) => {
  const {
    blocks,
    groups,
    sectionId,
    sectionName,
    isDraggable,
    selectedElementId,
    relatedGroups,
    onBlockClick,
    onGroupClick,
    onBlockCreate,
    onGroupCreate,
  } = props;

  const onAddElementClick = () => {
    if (onGroupCreate) {
      onGroupCreate(sectionId);
    }
  };

  return (
    <DFormEditableSection sectionId={sectionId} sectionName={sectionName} isDraggable={isDraggable}>
      {groups
        .filter(({ id }) => relatedGroups.includes(id))
        .map((group, index) => (
          <DFormEditableGroup
            groupId={group.id}
            groupName={group.name}
            groupIndex={index}
            isSelected={selectedElementId === group.id}
            isDraggable={isDraggable}
            relatedBlocks={group.relatedBlocks}
            onGroupClick={onGroupClick}
            onBlockCreate={onBlockCreate}
            key={group.id}
          >
            {
              // blocks.filter(({ id }) => group.relatedBlocks.includes(id))
              group.relatedBlocks
                .map((blockId) => blocks.find((block) => block.id === blockId))
                .map((block, index) => (
                  <DFormEditableBlock
                    label={block.label}
                    blockId={block.id}
                    groupId={group.id}
                    blockIndex={index}
                    helpText={block.helpText}
                    blockType={block.blockType}
                    fieldType={block.fieldType}
                    blockSize={block.blockSize}
                    isRequired={block.isRequired}
                    isSelected={selectedElementId === block.id}
                    isDraggable={isDraggable}
                    isLabelShowing={block.isLabelShowing}
                    onBlockClick={onBlockClick}
                    onBlockCreate={onBlockCreate}
                    key={block.id}
                  />
                ))
            }
          </DFormEditableGroup>
        ))}

      <DFormAddElement elementType={DFormElementTypes.Group} onClick={onAddElementClick} />
    </DFormEditableSection>
  );
};
