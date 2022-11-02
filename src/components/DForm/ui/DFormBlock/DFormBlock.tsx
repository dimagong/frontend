import React from "react";
import type { FC } from "react";

import { DFormBlockTypes, DFormFieldTypes } from "../../types";

import { DFormResource } from "../DFormResource";
import { DFormHelpText } from "../DFormHelpText";
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
};

export const DFormBlock: FC<Props> = (props) => {
  const { blockType, fieldType, ...blockProps } = props;
  const { label, uiStyle, options, helpText, dateFormat, isDisabled, isRequired, isLabelShowing, masterSchemaFieldId } =
    blockProps;

  switch (blockType) {
    case DFormBlockTypes.Field:
      if (fieldType === undefined) {
        throw new Error("Unexpected: To render block field, provide a fieldType.");
      }

      return (
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
    case DFormBlockTypes.Resource:
      return (
        <DFormFieldItem isRequired={isRequired} masterSchemaFieldId={masterSchemaFieldId}>
          <DFormResource
            label={label}
            isDisabled={isDisabled}
            isLabelShowing={isLabelShowing}
            masterSchemaFieldId={masterSchemaFieldId}
          />
        </DFormFieldItem>
      );
    case DFormBlockTypes.HelpText:
      return <DFormHelpText helpText={helpText} />;
  }
};
