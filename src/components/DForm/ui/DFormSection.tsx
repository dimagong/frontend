import React from "react";
import { Form, FormProps } from "antd";
import type { FC, ReactNode } from "react";
import { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Groups from "../Components/Groups";
import { DFormSchema } from "../types/dformSchema";
import { ElementTypes } from "../types/elementTypes";
import { DragIndicator } from "@material-ui/icons";

const validateMessages = {
  required: "Is required!",
};

type Props = {
  id: string;
  schema: DFormSchema;
  actions?: ReactNode;
  isHidden: boolean;
  isDisabled: boolean;
  relatedGroups: Array<string>;
  initialValues?: FormProps["initialValues"];
  selectedElement?: any;
  onFieldCreate?: (groupId: string) => void;
  onGroupCreate?: (sectionId: string) => void;
  onElementClick?: (el: any, type: "field" | "group" | "section") => void;
  onReorder?: (result: DropResult) => void;
  isDraggable?: boolean;
  setIsDraggable?: any;
};

export const DFormSection: FC<Props> = (props) => {
  const {
    id,
    schema,
    actions,
    isHidden = false,
    isDisabled = false,
    relatedGroups,
    initialValues,
    selectedElement,
    onGroupCreate: propOnGroupCreate,
    onFieldCreate,
    onElementClick,
    onReorder,
    setIsDraggable,
  } = props;

  const [form] = Form.useForm();

  const onGroupCreate = () => {
    if (propOnGroupCreate) {
      propOnGroupCreate(id);
    }
  };

  if (isHidden) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDraggable(false);

    if (result.destination === null || result.destination!.index === result.source.index) return;

    onReorder?.(result);
  };

  return (
    <Form form={form} name={id} layout="vertical" initialValues={initialValues} validateMessages={validateMessages}>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setIsDraggable(true)}>
        <Droppable
          droppableId={"Group"}
          type={ElementTypes.Group}
          renderClone={(provided, snapshot, rubric) => (
            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
              <>
                <div className="draggable-wrapper">
                  <span className="nested-draggable-list_item-drag-icon group-drag-icon" {...provided.dragHandleProps}>
                    <DragIndicator />
                  </span>
                  <div className={"group-title group-title--draggable"}>
                    <span className="text-bold-500">{schema.groups[rubric.draggableId].name}</span>
                  </div>
                </div>
              </>
            </div>
          )}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Groups
                data={schema}
                sectionId={id}
                isDisabled={isDisabled}
                selectedElement={selectedElement}
                sectionGroups={relatedGroups}
                onGroupCreate={onGroupCreate}
                onFieldCreate={onFieldCreate}
                onElementClick={onElementClick}
              />
              {actions}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Form>
  );
};
