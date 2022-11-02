import React, { MouseEventHandler } from "react";
import type { FC, ReactNode } from "react";
import { Droppable } from "react-beautiful-dnd";

import { DFormBaseGroup } from "./DFormBaseGroup";
import { DFormElementTypes } from "../../types";
import { DFormEditable } from "../DFormEditable";

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
  // ToDo: use isDFormAccessible to Field as isDisabled
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
