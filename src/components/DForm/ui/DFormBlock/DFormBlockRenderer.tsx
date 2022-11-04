import React from "react";
import type { FC } from "react";

import { DFormBlockTypes, DFormFieldTypes } from "../../types";

import { DFormField, DFormFieldProps } from "../DFormField";
import { DFormResource, DFormResourceProps } from "../DFormResource";
import { DFormHelpText, DFormHelpTextProps } from "../DFormHelpText";

type ToFieldOmit = "id" | "value" | "checked" | "fieldType" | "onChange";

type DFormFieldBlockProps = Omit<DFormFieldProps, ToFieldOmit>;

type DFormBlocksProps = DFormFieldBlockProps & DFormResourceProps & DFormHelpTextProps;

export type DFormBlockRendererProps = DFormBlocksProps & {
  blockType: DFormBlockTypes;
  fieldType?: DFormFieldTypes;
};

export const DFormBlockRenderer: FC<DFormBlockRendererProps> = (props) => {
  const { blockType, fieldType, children, ...blockProps } = props;
  const { label, uiStyle, options, helpText, dateFormat, isDisabled, isRequired, isLabelShowing, masterSchemaFieldId } =
    blockProps;

  switch (blockType) {
    case DFormBlockTypes.Field:
      return (
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
      );
    case DFormBlockTypes.Resource:
      return (
        <DFormResource
          label={label}
          isDisabled={isDisabled}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
        />
      );
    case DFormBlockTypes.HelpText:
      return <DFormHelpText helpText={helpText} />;
    default:
      throw new Error(`Unreachable: A block type is not recognized.`);
  }
};