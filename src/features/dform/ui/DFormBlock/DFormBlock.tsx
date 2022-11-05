import React from "react";
import type { FC } from "react";

import { DFormBlockTypes, DFormFieldTypes, DFormBlockSizeTypes } from "../../types";

import { DFormHelpText } from "../DFormHelpText";
import { DFormBaseBlock } from "./DFormBaseBlock";
import { DFormBlockSizer } from "./DFormBlockSizer";
import type { DFormFieldProps } from "../DFormField";
import type { DFormHelpTextProps } from "../DFormHelpText";
import { DFormField, DFormFieldItem, DFormFieldItemProps } from "../DFormField";

type ToFieldOmit = "id" | "value" | "checked" | "fieldType" | "onChange";

type DFormFieldBlockProps = Omit<DFormFieldProps, ToFieldOmit> &
  Pick<DFormFieldItemProps, "minimum" | "maximum" | "minLength" | "maxLength">;

type DFormBlocksProps = DFormFieldBlockProps & DFormHelpTextProps;

type Props = DFormBlocksProps & {
  blockType: DFormBlockTypes;
  fieldType?: DFormFieldTypes;
  blockSize?: DFormBlockSizeTypes;
};

export const DFormBlock: FC<Props> = (props) => {
  const { blockType, fieldType, blockSize, ...blockProps } = props;
  const { label, uiStyle, options, helpText, format, isDisabled, isRequired, isLabelShowing, masterSchemaFieldId } =
    blockProps;

  let Block;
  switch (blockType) {
    case DFormBlockTypes.Field:
      Block = (
        <DFormFieldItem fieldType={fieldType} isRequired={isRequired} masterSchemaFieldId={masterSchemaFieldId}>
          <DFormField
            id={String(masterSchemaFieldId)}
            label={label}
            format={format}
            options={options}
            uiStyle={uiStyle}
            fieldType={fieldType}
            isRequired={isRequired}
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

  return (
    <DFormBlockSizer blockSize={blockSize}>
      <DFormBaseBlock>{Block}</DFormBaseBlock>
    </DFormBlockSizer>
  );
};
