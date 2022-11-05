import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormEditableBlock } from "../DFormBlock";
import { DFormEditableGroup } from "../DFormGroup";
import { mockStoriesGroups } from "./mockStoriesGroups";
import { DFormEditableSection } from "./DFormEditableSection";
import { mockStoriesBlocks } from "../DFormGroup/mockStoriesBlocks";

export default {
  title: "DForm/EditableSection",
  component: DFormEditableSection,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DragDropContext onDragEnd={() => {}}>
        <DFormEditableSection
          sectionId={props.sectionId}
          sectionName={props.sectionName}
          isDraggable={props.isDraggable}
        >
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
      </DragDropContext>
    </QueryClientProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  sectionId: "sectionId",
  sectionName: "Section name",
  isDraggable: true,
};
