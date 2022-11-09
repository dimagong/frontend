import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { NmpCol } from "features/nmp-ui";

import { DFormGroup } from "../DFormGroup";
import { DFormElementTypes } from "../../types";
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
  relatedBlocks?: string[];
  onGroupClick?: (groupId: string) => void;
  onBlockCreate?: (groupId: string) => void;
  children?: ReactNode;
};

export const DFormEditableGroup: FC<Props> = (props) => {
  const {
    groupId,
    groupName,
    groupIndex,
    isSelected,
    isDraggable,
    relatedBlocks = [],
    onGroupClick,
    onBlockCreate,
    children,
  } = props;

  const onAddElementClick = () => {
    if (onBlockCreate) {
      onBlockCreate(groupId);
    }
  };

  const onSelectableClick = () => {
    if (onGroupClick) {
      onGroupClick(groupId);
    }
  };

  return (
    <DFormDraggable draggableId={groupId} isDraggable={isDraggable} draggableIndex={groupIndex}>
      {(dragHandleProps) => (
        <DFormDroppable droppableId={groupId} droppableType={DFormElementTypes.Block} isDraggable={isDraggable}>
          <DFormGroup
            groupName={groupName}
            renderTitle={(node) => (
              <DFormDragHandle {...dragHandleProps} isDraggable={isDraggable} isMiddle>
                <DFormSelectable isSelected={isSelected} isMishandled onClick={onSelectableClick}>
                  {node}
                </DFormSelectable>
              </DFormDragHandle>
            )}
            isEmptyTitleRendered
          >
            {children}

            {relatedBlocks.length === 0 ? (
              <DFormAddElement elementType={DFormElementTypes.Block} onClick={onAddElementClick} />
            ) : null}
          </DFormGroup>
        </DFormDroppable>
      )}
    </DFormDraggable>
  );
};
