import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { DFormEditableBlock } from "./DFormEditableBlock";
import { DFormBlockTypes, DFormFieldTypes } from "../../types";

export default {
  title: "DFormEditableBlock",
  component: DFormEditableBlock,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DragDropContext onDragEnd={props.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <DFormEditableBlock
                label={props.label}
                blockId={props.blockId}
                helpText={props.helpText}
                blockType={props.blockType}
                fieldType={props.fieldType}
                blockIndex={props.blockIndex}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </QueryClientProvider>
  );
};

const defaultArgs = {
  blockId: "draggableId",
  blockIndex: 0,
};

export const HelpTextBlock = Template.bind({});
HelpTextBlock.args = {
  ...defaultArgs,
  helpText: "<b>Bold+<i>cursive</i></b>",
  blockType: DFormBlockTypes.HelpText,
};

export const ResourceBlock = Template.bind({});
ResourceBlock.args = {
  ...defaultArgs,
  blockType: DFormBlockTypes.Resource,
};

export const FieldBlock = Template.bind({});
FieldBlock.args = {
  ...defaultArgs,
  label: "Label",
  fieldType: DFormFieldTypes.Text,
  blockType: DFormBlockTypes.Field,
};
