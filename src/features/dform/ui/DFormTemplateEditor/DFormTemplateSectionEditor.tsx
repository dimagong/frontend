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
  onBlockCreate?: (groupId: string) => void;
  onGroupCreate?: (sectionId: string) => void;
};

export const DFormTemplateSectionEditor: FC<DFormTemplateEditorProps> = (props) => {
  const {
    blocks,
    groups,
    sectionId,
    sectionName,
    isDraggable = false,
    selectedElementId,
    relatedGroups,
    onBlockClick,
    onGroupClick,
    onBlockCreate,
    onGroupCreate,
  } = props;

  const onGroupAdd = () => {
    if (onGroupCreate) {
      onGroupCreate(sectionId);
    }
  };

  const onBlockCreateBlock = (groupId: string) => {
    if (onBlockCreate) {
      onBlockCreate(groupId);
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
            {blocks
              .filter(({ id }) => group.relatedBlocks.includes(id))
              .map((block, index) => (
                <DFormEditableBlock
                  label={block.label}
                  blockId={block.id}
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
                  onBlockCreate={() => onBlockCreateBlock(group.id)}
                  key={block.id}
                />
              ))}
          </DFormEditableGroup>
        ))}

      <NmpCol span="24">
        <DFormAddElement elementType={DFormElementTypes.Group} onGroupAdd={onGroupAdd} />
      </NmpCol>
    </DFormEditableSection>
  );
};
