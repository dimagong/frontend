import React from "react";
import type { FC, MouseEventHandler } from "react";

import { DFormSelectable } from "../DFormSelectable";
import { DFormAddElement } from "../DFormAddElement";
import { DFormBlock, DFormBlockProps } from "../DFormBlock";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";
import { DFormFile, DFormFiles, DFormFieldTypes, DFormElementTypes } from "../../types";

const getFile = (file_id: number): DFormFile => ({
  custom_filename: `Custom-${file_id}.filename`,
  name: `filename-${file_id}.test`,
  file_id,
});

const fileValue = getFile(0);
const filesValue: DFormFiles = Array(3)
  .fill(null)
  .map((_, index) => getFile(index));

const getValueByFieldType = (fieldType?: DFormFieldTypes) => {
  switch (fieldType) {
    case DFormFieldTypes.File:
      return [fileValue];
    case DFormFieldTypes.FileList:
      return filesValue;
    case DFormFieldTypes.Resource:
      return fileValue;
    default:
      return undefined;
  }
};

type Props = Pick<
  DFormBlockProps,
  | "label"
  | "format"
  | "uiStyle"
  | "options"
  | "helpText"
  | "blockType"
  | "fieldType"
  | "blockSize"
  | "isRequired"
  | "isLabelShowing"
> & {
  blockId: string;
  blockIndex: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: MouseEventHandler;
  onBlockAdd?: MouseEventHandler;
};

export const DFormEditableBlock: FC<Props> = (props) => {
  const {
    blockId,
    blockType,
    fieldType,
    blockSize,
    blockIndex,
    isSelected,
    isDraggable,
    onClick,
    onBlockAdd,
    ...blockProps
  } = props;
  const { label, uiStyle, options, helpText, format, isRequired, isLabelShowing } = blockProps;

  return (
    <DFormDraggable draggableId={blockId} isDraggable={isDraggable} draggableIndex={blockIndex}>
      {(dragHandleProps) => (
        <DFormAddElement
          elementType={DFormElementTypes.Block}
          onBlockAdd={onBlockAdd}
          isVisible={!isDraggable}
          isHoverable
        >
          <DFormDragHandle {...dragHandleProps} isDraggable={isDraggable} isMiddle>
            <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
              <DFormBlock
                value={getValueByFieldType(fieldType) as any}
                label={label}
                format={format}
                uiStyle={uiStyle}
                options={options}
                helpText={helpText}
                blockType={blockType}
                blockSize={isDraggable ? undefined : blockSize}
                fieldType={fieldType}
                isRequired={isRequired}
                isLabelShowing={isLabelShowing}
              />
            </DFormSelectable>
          </DFormDragHandle>
        </DFormAddElement>
      )}
    </DFormDraggable>
  );
};
