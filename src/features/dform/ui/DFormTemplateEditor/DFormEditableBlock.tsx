import type { FC } from "react";
import React from "react";

import { DFormBlock } from "../DFormBlock";
import { DFormSelectable } from "../DFormSelectable";
import { DFormAddElement } from "../DFormAddElement";
import { DformSchemaContext } from "../DformSchemaContext";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";
import {
  DformBlockId,
  DformBlockModel,
  DformBlockSizeTypes,
  DformBlockTypes,
  DformElementTypes,
  DformFieldTypes,
  DformFileValueType,
  DformGroupId,
} from "../../data/models";

const getFile = (file_id: number): DformFileValueType => ({
  custom_filename: `Custom-${file_id}.filename`,
  name: `filename-${file_id}.test`,
  file_id,
});

const fileValue = getFile(0);
const filesValue: DformFileValueType[] = Array(3)
  .fill(null)
  .map((_, index) => getFile(index));

const getValueByBlock = (block: DformBlockModel) => {
  if (block.blockType !== DformBlockTypes.Field) {
    return undefined;
  }

  switch (block.fieldType) {
    case DformFieldTypes.File:
      return [fileValue];
    case DformFieldTypes.FileList:
      return filesValue;
    case DformFieldTypes.Resource:
      return fileValue;
    default:
      return undefined;
  }
};

export type DFormEditableBlockProps = {
  groupId: DformGroupId;
  blockId: DformBlockId;
  blockSize: DformBlockSizeTypes;
  blockIndex: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  onBlockClick?: (blockId: DformBlockId) => void;
  onBlockCreate?: (groupId: DformGroupId, blockId: DformBlockId) => void;
};

export const DFormEditableBlock: FC<DFormEditableBlockProps> = (props) => {
  const { groupId, blockId, blockSize, blockIndex, isSelected, isDraggable, onBlockClick, onBlockCreate } = props;

  const { dformSchema } = DformSchemaContext.useContext();
  const block = dformSchema.getBlockById(blockId);

  const onSelectableClick = () => {
    if (onBlockClick) {
      onBlockClick(blockId);
    }
  };

  const onAddElementClick = () => {
    if (onBlockCreate) {
      onBlockCreate(groupId, blockId);
    }
  };

  return (
    <DFormDraggable draggableId={blockId} isDraggable={isDraggable} draggableIndex={blockIndex}>
      {(dragHandleProps) => (
        <DFormAddElement
          isVisible={!isDraggable}
          isHoverable
          elementType={DformElementTypes.Block}
          onClick={onAddElementClick}
        >
          <DFormDragHandle {...dragHandleProps} isDraggable={isDraggable} isMiddle>
            <DFormSelectable isSelected={isSelected} isMishandled onClick={onSelectableClick}>
              <DFormBlock
                {...block}
                value={getValueByBlock(block) as any}
                blockSize={isDraggable ? undefined : blockSize}
              />
            </DFormSelectable>
          </DFormDragHandle>
        </DFormAddElement>
      )}
    </DFormDraggable>
  );
};
