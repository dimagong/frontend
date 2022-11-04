import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { DFormElementTypes } from "../../types";
import { DFormBaseGroup } from "./DFormBaseGroup";
import { DFormDroppable } from "../DFormDroppable";
import { DFormSelectable } from "../DFormSelectable";
import { DFormAddElement } from "../DFormAddElement";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";

type Props = {
  groupId: string;
  groupName: string;
  groupIndex: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: MouseEventHandler;
  onGroupAdd?: MouseEventHandler;
  children?: ReactNode;
};

export const DFormEditableGroup: FC<Props> = (props) => {
  const { groupId, groupName, groupIndex, isSelected, isDraggable, onClick, onGroupAdd, children } = props;

  return (
    <DFormDraggable draggableId={groupId} isDraggable={isDraggable} draggableIndex={groupIndex}>
      {(dragHandleProps) => (
        <DFormDroppable droppableId={groupId} droppableType={DFormElementTypes.Block} isDraggable={isDraggable}>
          <DFormBaseGroup
            groupName={groupName}
            renderTitle={(node) => (
              <DFormDragHandle {...dragHandleProps}>
                <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
                  {node}
                </DFormSelectable>
              </DFormDragHandle>
            )}
            isEmptyTitleRendered
          >
            {children}
          </DFormBaseGroup>
        </DFormDroppable>
      )}
    </DFormDraggable>
  );
};
