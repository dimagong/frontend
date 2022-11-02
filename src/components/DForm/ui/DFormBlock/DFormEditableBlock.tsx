import "./dform-editable-block.scss";

import React from "react";
import classnames from "classnames";
import type { FC, MouseEventHandler } from "react";

import { DFormField } from "../DFormField";
import { DFormResource } from "../DFormResource";
import { DFormHelpText } from "../DFormHelpText";
import { DFormBaseBlock } from "./DFormBaseBlock";
import { DFormDraggable } from "../DFormDraggable";
import type { DFormFieldProps } from "../DFormField";
import type { DFormResourceProps } from "../DFormResource";
import type { DFormHelpTextProps } from "../DFormHelpText";
import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

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
  onBlockClick?: MouseEventHandler<HTMLDivElement>;
};

export const DFormEditableBlock: FC<Props> = (props) => {
  const { blockId, blockType, fieldType, blockSize, blockIndex, isSelected, onBlockClick, ...blockProps } = props;
  const { label, uiStyle, options, helpText, dateFormat, isRequired, isLabelShowing } = blockProps;

  let Block;
  switch (blockType) {
    case DFormBlockTypes.Field:
      if (fieldType === undefined) {
        throw new Error("Unexpected: To render block field, provide a fieldType.");
      }

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
    <DFormBaseBlock blockSize={blockSize}>
      <div className={classnames("dform-editable", { "dform-editable--selected": isSelected })}>
        <DFormDraggable index={blockIndex} draggableId={blockId}>
          <div className="dform-editable__content" onClick={onBlockClick}>
            {Block}
          </div>
        </DFormDraggable>
      </div>
    </DFormBaseBlock>
  );
};
