import React from "react";
import type { FC, MouseEventHandler } from "react";

import { DFormField } from "../DFormField";
import { DFormHelpText } from "../DFormHelpText";
import { DFormBaseBlock } from "./DFormBaseBlock";
import { DFormBlockSizer } from "./DFormBlockSizer";
import { DFormSelectable } from "../DFormSelectable";
import { DFormAddElement } from "../DFormAddElement";
import type { DFormFieldProps } from "../DFormField";
import type { DFormHelpTextProps } from "../DFormHelpText";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";
import {
  DFormBlockSizeTypes,
  DFormBlockTypes,
  DFormElementTypes,
  DFormFieldTypes,
  DFormFile,
  DFormFiles,
} from "../../types";

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

type ToFieldOmit = "id" | "value" | "checked" | "fieldType" | "isDisabled" | "masterSchemaFieldId" | "onChange";

type DFormBlocksProps = Omit<DFormFieldProps, ToFieldOmit> & DFormHelpTextProps;

type Props = DFormBlocksProps & {
  blockId: string;
  blockType: DFormBlockTypes;
  fieldType?: DFormFieldTypes;
  blockSize?: DFormBlockSizeTypes;
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

  let Block;
  switch (blockType) {
    case DFormBlockTypes.Field:
      Block = (
        <DFormField
          value={getValueByFieldType(fieldType)}
          label={label}
          format={format}
          uiStyle={uiStyle}
          options={options}
          fieldType={fieldType}
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
        />
      );
      break;
    case DFormBlockTypes.HelpText:
      Block = <DFormHelpText helpText={helpText} />;
      break;
  }

  return (
    <DFormBlockSizer blockSize={isDraggable ? DFormBlockSizeTypes.Full : blockSize}>
      <DFormDraggable draggableId={blockId} isDraggable={isDraggable} draggableIndex={blockIndex}>
        {(dragHandleProps) => (
          <DFormAddElement elementType={DFormElementTypes.Block} onBlockAdd={onBlockAdd} isHoverable>
            <DFormBaseBlock>
              <DFormDragHandle {...dragHandleProps}>
                <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
                  {Block}
                </DFormSelectable>
              </DFormDragHandle>
            </DFormBaseBlock>
          </DFormAddElement>
        )}
      </DFormDraggable>
    </DFormBlockSizer>
  );
};
