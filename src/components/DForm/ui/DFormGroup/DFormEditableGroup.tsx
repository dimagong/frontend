import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { DFormBaseGroup } from "./DFormBaseGroup";
import { DFormSelectable } from "../DFormSelectable";
import { DFormDroppableGroup } from "./DFormGroupDroppable";
import { DFormDraggable, DFormDragHandleBlock } from "../DFormDraggable";

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

  return (
    <DFormDraggable draggableId={groupId} isDraggable={isDraggable} draggableIndex={groupIndex}>
      {(dragHandle) => (
        <DFormDroppableGroup droppableId={groupId} isDraggable={isDraggable}>
          <DFormBaseGroup
            groupName={groupName}
            renderTitle={(node) => (
              <DFormDragHandleBlock dragHandle={dragHandle}>
                <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
                  {node}
                </DFormSelectable>
              </DFormDragHandleBlock>
            )}
          >
            {children}
          </DFormBaseGroup>
        </DFormDroppableGroup>
      )}
    </DFormDraggable>
  );
};
