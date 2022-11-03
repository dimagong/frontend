import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { DFormBaseGroup } from "./DFormBaseGroup";
import { DFormDraggable } from "../DFormDraggable";
import { DFormSelectable } from "../DFormSelectable";
import { DFormGroupWrapper } from "./DFormGroupWrapper";
import { DFormDroppableGroup } from "./DFormGroupDroppable";

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
    <DFormDraggable
      draggableId={groupId}
      isDraggable={isDraggable}
      draggableIndex={groupIndex}
      wrapper={(node) => <DFormGroupWrapper>{node}</DFormGroupWrapper>}
    >
      <DFormDroppableGroup droppableId={groupId} isDraggable={isDraggable}>
        <DFormBaseGroup
          groupName={groupName}
          renderTitle={(node) => (
            <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
              {node}
            </DFormSelectable>
          )}
        >
          {children}
        </DFormBaseGroup>
      </DFormDroppableGroup>
    </DFormDraggable>
  );
};
