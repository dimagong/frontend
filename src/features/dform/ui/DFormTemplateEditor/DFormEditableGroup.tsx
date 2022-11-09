import React from "react";
import type { FC, ReactNode } from "react";

import { DFormGroup } from "../DFormGroup";
import { DFormDroppable } from "../DFormDroppable";
import { DFormSelectable } from "../DFormSelectable";
import { DFormAddElement } from "../DFormAddElement";
import { DformSchemaContext } from "../DformSchemaContext";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";
import { DformElementTypes, DformGroupId } from "../../data/models";

type Props = {
  groupId: DformGroupId;
  groupIndex: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  onGroupClick?: (groupId: DformGroupId) => void;
  onBlockCreate?: (groupId: DformGroupId) => void;
  children?: ReactNode;
};

export const DFormEditableGroup: FC<Props> = (props) => {
  const { groupId, groupIndex, isSelected, isDraggable, onGroupClick, onBlockCreate, children } = props;

  const { dformSchema } = DformSchemaContext.useContext();
  const group = dformSchema.getGroupById(groupId);

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
        <DFormDroppable droppableId={groupId} droppableType={DformElementTypes.Block} isDraggable={isDraggable}>
          <DFormGroup
            groupName={group.name}
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

            {group.relatedBlocksIds.length === 0 ? (
              <DFormAddElement elementType={DformElementTypes.Block} onClick={onAddElementClick} />
            ) : null}
          </DFormGroup>
        </DFormDroppable>
      )}
    </DFormDraggable>
  );
};
