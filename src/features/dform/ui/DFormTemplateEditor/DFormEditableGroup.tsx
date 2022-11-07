import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { DFormGroup } from "../DFormGroup";
import { DFormElementTypes } from "../../types";
import { DFormDroppable } from "../DFormDroppable";
import { DFormSelectable } from "../DFormSelectable";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";

type Props = {
  groupId: string;
  groupName: string;
  groupIndex: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: MouseEventHandler;
  children?: ReactNode;
};

export const DFormEditableGroup: FC<Props> = (props) => {
  const { groupId, groupName, groupIndex, isSelected, isDraggable, onClick, children } = props;

  return (
    <DFormDraggable draggableId={groupId} isDraggable={isDraggable} draggableIndex={groupIndex}>
      {(dragHandleProps) => (
        <DFormDroppable droppableId={groupId} droppableType={DFormElementTypes.Block} isDraggable={isDraggable}>
          <DFormGroup
            groupName={groupName}
            renderTitle={(node) => (
              <DFormDragHandle {...dragHandleProps} isDraggable={isDraggable} isMiddle>
                <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
                  {node}
                </DFormSelectable>
              </DFormDragHandle>
            )}
            isEmptyTitleRendered
          >
            {children}
          </DFormGroup>
        </DFormDroppable>
      )}
    </DFormDraggable>
  );
};
