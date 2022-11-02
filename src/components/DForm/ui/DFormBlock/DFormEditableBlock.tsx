import React from "react";
import type { FC } from "react";

import { DFormField } from "../DFormField";
import { DFormBlockTypes, DFormFieldTypes } from "../../types";
import { DFormResource } from "../DFormResource";
import { DFormHelpText } from "../DFormHelpText";
import { DFormDraggable } from "../DFormDraggable";
import type { DFormFieldProps } from "../DFormField";
import type { DFormResourceProps } from "../DFormResource";
import type { DFormHelpTextProps } from "../DFormHelpText";

type ToFieldOmit =
  | "id"
  | "value"
  | "checked"
  | "fieldType"
  | "options"
  | "isDisabled"
  | "masterSchemaFieldId"
  | "onChange";

type DFormBlocksProps = Omit<DFormFieldProps, ToFieldOmit> &
  Omit<DFormResourceProps, "isDisabled" | "masterSchemaFieldId"> &
  DFormHelpTextProps;

type Props = DFormBlocksProps & {
  blockId: string;
  blockType: DFormBlockTypes;
  fieldType?: DFormFieldTypes;
  blockIndex: number;
};

export const DFormEditableBlock: FC<Props> = (props) => {
  const { blockId, blockType, fieldType, blockIndex, ...blockProps } = props;
  const { label, uiStyle, helpText, dateFormat, isRequired, isLabelShowing } = blockProps;

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
    <DFormDraggable index={blockIndex} draggableId={blockId}>
      {Block}
    </DFormDraggable>
  );
};
