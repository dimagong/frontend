import React from "react";
import type { FC } from "react";

import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

import { DFormResource } from "../DFormResource";
import { DFormHelpText } from "../DFormHelpText";
import { DFormBaseBlock } from "./DFormBaseBlock";
import type { DFormFieldProps } from "../DFormField";
import type { DFormResourceProps } from "../DFormResource";
import type { DFormHelpTextProps } from "../DFormHelpText";
import { DFormField, DFormFieldItem, DFormFieldItemProps } from "../DFormField";

type ToFieldOmit = "id" | "value" | "checked" | "fieldType" | "onChange";

type DFormFieldBlockProps = Omit<DFormFieldProps, ToFieldOmit> &
  Pick<DFormFieldItemProps, "minimum" | "maximum" | "minLength" | "maxLength">;

type DFormBlocksProps = DFormFieldBlockProps & DFormResourceProps & DFormHelpTextProps;

type Props = DFormBlocksProps & {
  blockType: DFormBlockTypes;
  fieldType?: DFormFieldTypes;
  blockSize?: DFormBlockSizeTypes;
};

export const DFormBlock: FC<Props> = (props) => {
  const { blockType, fieldType, blockSize, ...blockProps } = props;
  const { label, uiStyle, options, helpText, dateFormat, isDisabled, isRequired, isLabelShowing, masterSchemaFieldId } =
    blockProps;

  let Block;

  switch (blockType) {
    case DFormBlockTypes.Field:
      if (fieldType === undefined) {
        throw new Error("Unexpected: To render block field, provide a fieldType.");
      }

      Block = (
        <DFormFieldItem fieldType={fieldType} isRequired={isRequired} masterSchemaFieldId={masterSchemaFieldId}>
          <DFormField
            id={String(masterSchemaFieldId)}
            label={label}
            options={options}
            uiStyle={uiStyle}
            fieldType={fieldType}
            dateFormat={dateFormat}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isLabelShowing={isLabelShowing}
            masterSchemaFieldId={masterSchemaFieldId}
          />
        </DFormFieldItem>
      );
      break;
    case DFormBlockTypes.Resource:
      Block = (
        <DFormFieldItem isRequired={isRequired} masterSchemaFieldId={masterSchemaFieldId}>
          <DFormResource
            label={label}
            isDisabled={isDisabled}
            isLabelShowing={isLabelShowing}
            masterSchemaFieldId={masterSchemaFieldId}
          />
        </DFormFieldItem>
      );
      break;
    case DFormBlockTypes.HelpText:
      Block = <DFormHelpText helpText={helpText} />;
      break;
  }

  return <DFormBaseBlock blockSize={blockSize}>{Block}</DFormBaseBlock>;
};
