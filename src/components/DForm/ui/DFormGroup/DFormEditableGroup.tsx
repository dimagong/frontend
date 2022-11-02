import React from "react";
import { Droppable } from "react-beautiful-dnd";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { DFormElementTypes } from "../../types";
import { DFormEditable } from "../DFormEditable";
import { DFormBaseGroup } from "./DFormBaseGroup";

type Props = {
  groupId: string;
  groupName: string;
  groupIndex: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
};

export const DFormEditableGroup: FC<Props> = (props) => {
  const { groupId, groupName, groupIndex, isSelected, isDraggable, children, onClick } = props;

  const BaseGroup = <DFormBaseGroup groupName={groupName}>{children}</DFormBaseGroup>;

  return (
    <DFormEditable
      editableId={groupId}
      editableIndex={groupIndex}
      isSelected={isSelected}
      isDraggable={isDraggable}
      onClick={onClick}
    >
      {isDraggable ? (
        <Droppable droppableId={groupId} type={DFormElementTypes.Block}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {BaseGroup}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        BaseGroup
      )}
    </DFormEditable>
  );
};
