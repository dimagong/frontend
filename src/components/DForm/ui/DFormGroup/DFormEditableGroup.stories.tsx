import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormEditableBlock } from "../DFormBlock";
import { DFormEditableGroup } from "./DFormEditableGroup";
import { MockStoriesBlocks } from "./mockStoriesBlocks";
import { DFormElementTypes } from "../../types";

export default {
  title: "DFormEditableGroup",
  component: DFormEditableGroup,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="droppableId" type={DFormElementTypes.Group}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <DFormEditableGroup
                groupId={props.groupId}
                groupName={props.groupName}
                groupIndex={0}
                isSelected={props.isSelected}
                isDraggable={props.isDraggable}
              >
                {MockStoriesBlocks.map((blockProps, index) => (
                  <DFormEditableBlock
                    label={blockProps.label}
                    blockId={blockProps.blockId}
                    blockIndex={index}
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

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </QueryClientProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  groupId: "groupId",
  groupName: "Group name",
  isSelected: true,
  isDraggable: true,
};
