import React from "react";
import type { FC } from "react";

import { mockStoriesGroups } from "../mockStoriesGroups";
import { DFormEditableGroup } from "./DFormEditableGroup";
import { mockStoriesBlocks } from "../mockStoriesBlocks";
import { DFormEditableBlock } from "./DFormEditableBlock";
import { DFormEditableSection } from "./DFormEditableSection";

export type DFormTemplateEditorProps = {
  sectionId: string;
  sectionName: string;
  isDraggable?: boolean;
};

export const DFormTemplateSectionEditor: FC<DFormTemplateEditorProps> = (props) => {
  const { sectionId, sectionName, isDraggable = false } = props;

  return (
    <DFormEditableSection sectionId={sectionId} sectionName={sectionName} isDraggable={isDraggable}>
      {mockStoriesGroups.map((groupProps, groupIndex) => (
        <DFormEditableGroup
          groupId={groupProps.groupId}
          groupName={groupProps.groupName}
          groupIndex={groupIndex}
          isDraggable={props.isDraggable}
          key={groupProps.groupId}
        >
          {mockStoriesBlocks
            .map((block, blockIndex) => ({
              ...block,
              blockId: groupProps.groupId + groupProps.relatedBlocks[blockIndex],
              ...(block.masterSchemaFieldId
                ? { masterSchemaFieldId: Number(groupProps.groupId + groupProps.relatedBlocks[blockIndex]) }
                : {}),
            }))
            .map((blockProps, blockIndex) => (
              <DFormEditableBlock
                label={blockProps.label}
                blockId={blockProps.blockId}
                blockIndex={blockIndex}
                helpText={blockProps.helpText}
                blockType={blockProps.blockType}
                fieldType={blockProps.fieldType}
                blockSize={blockProps.blockSize}
                isRequired={blockProps.isRequired}
                isDraggable={props.isDraggable}
                isLabelShowing={blockProps.isLabelShowing}
                key={blockProps.blockId}
              />
            ))}
        </DFormEditableGroup>
      ))}
    </DFormEditableSection>
  );
};
