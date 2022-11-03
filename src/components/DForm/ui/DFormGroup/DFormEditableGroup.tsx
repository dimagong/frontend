import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { DFormElementTypes } from "../../types";
import { DFormBaseGroup } from "./DFormBaseGroup";
import { DFormDroppable } from "../DFormDroppable";
import { DFormSelectable } from "../DFormSelectable";
import { DFormDraggable, DFormDragHandleBlock } from "../DFormDraggable";
import { DFormAddElement } from "../DFormAddElement";

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
      {(dragHandle) => (
        <DFormDroppable droppableId={groupId} droppableType={DFormElementTypes.Block} isDraggable={isDraggable}>
          <DFormAddElement elementType={DFormElementTypes.Group} onGroupAdd={onGroupAdd}>
            <DFormBaseGroup
              groupName={groupName}
              renderTitle={(node) => (
                <DFormDragHandleBlock dragHandle={dragHandle}>
                  <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
                    {node}
                  </DFormSelectable>
                </DFormDragHandleBlock>
              )}
              isEmptyTitleRendered
            >
              {children}
            </DFormBaseGroup>
          </DFormAddElement>
        </DFormDroppable>
      )}
    </DFormDraggable>
  );
};
