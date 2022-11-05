import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { DFormEditableBlock } from "./DFormEditableBlock";
import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

export default {
  title: "DForm/EditableBlock",
  component: DFormEditableBlock,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <DFormEditableBlock
                label={props.label}
                format={props.format}
                uiStyle={props.uiStyle}
                options={props.options}
                blockId={props.blockId}
                helpText={props.helpText}
                blockType={props.blockType}
                fieldType={props.fieldType}
                blockSize={props.blockSize}
                blockIndex={props.blockIndex}
                isSelected={props.isSelected}
                isDraggable={props.isDraggable}
                isRequired={props.isRequired}
                isLabelShowing={props.isLabelShowing}
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
  isSelected: true,
  isDraggable: true,
  blockSize: DFormBlockSizeTypes.Full,
};

export const HelpTextBlock = Template.bind({});
HelpTextBlock.args = {
  ...defaultArgs,
  helpText: "<b>Bold+<i>cursive</i></b>",
  blockType: DFormBlockTypes.HelpText,
};

export const FieldBlock = Template.bind({});
FieldBlock.args = {
  ...defaultArgs,
  label: "Label",
  options: ["option 1", "option 2", "option 3", "option 4"],
  fieldType: DFormFieldTypes.Text,
  blockType: DFormBlockTypes.Field,
};
