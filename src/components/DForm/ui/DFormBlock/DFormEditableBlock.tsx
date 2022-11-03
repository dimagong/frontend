import type { FC, MouseEventHandler } from "react";
import React from "react";

import type { DFormFieldProps } from "../DFormField";
import { DFormField } from "../DFormField";
import type { DFormHelpTextProps } from "../DFormHelpText";
import { DFormHelpText } from "../DFormHelpText";
import type { DFormResourceProps } from "../DFormResource";
import { DFormResource } from "../DFormResource";
import { DFormBaseBlock } from "./DFormBaseBlock";
import { DFormBlockSizer } from "./DFormBlockSizer";
import { DFormSelectable } from "../DFormSelectable";
import { DFormAddElement } from "../DFormAddElement";
import { DFormDraggable, DFormDragHandleBlock } from "../DFormDraggable";
import { DFormBlockSizeTypes, DFormBlockTypes, DFormElementTypes, DFormFieldTypes } from "../../types";

type ToFieldOmit = "id" | "value" | "checked" | "fieldType" | "isDisabled" | "masterSchemaFieldId" | "onChange";

type DFormBlocksProps = Omit<DFormFieldProps, ToFieldOmit> &
  Omit<DFormResourceProps, "isDisabled" | "masterSchemaFieldId"> &
  DFormHelpTextProps;

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
  const { label, uiStyle, options, helpText, dateFormat, isRequired, isLabelShowing } = blockProps;

  let Block;
  switch (blockType) {
    case DFormBlockTypes.Field:
      Block = (
        <DFormField
          label={label}
          uiStyle={uiStyle}
          options={options}
          fieldType={fieldType}
          dateFormat={dateFormat}
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
        />
      );
      break;
    case DFormBlockTypes.Resource:
      Block = (
        <DFormResource
          value={{ custom_filename: "Custom.filename", name: "filename.test", file_id: 0 }}
          label={label}
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
        {(dragHandle) => (
          <DFormAddElement elementType={DFormElementTypes.Block} onBlockAdd={onBlockAdd} isHoverable>
            <DFormBaseBlock>
              <DFormDragHandleBlock dragHandle={dragHandle}>
                <DFormSelectable isSelected={isSelected} isMishandled onClick={onClick}>
                  {Block}
                </DFormSelectable>
              </DFormDragHandleBlock>
            </DFormBaseBlock>
          </DFormAddElement>
        )}
      </DFormDraggable>
    </DFormBlockSizer>
  );
};
