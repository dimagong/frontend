import React from "react";
import type { FC } from "react";

import { DFormItem } from "../DFormItem";
import { DFormBaseField } from "./DFormBaseField";

import { DFormFieldTypes } from "../../types";
import type { DFormFieldRendererProps } from "./DFormFieldRenderer";

type Props = DFormFieldRendererProps & {
  label?: string;
  isRequired: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId: number;
  // validation
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
};

export const DFormField: FC<Props> = (props) => {
  const {
    label,
    isRequired,
    isLabelShowing,
    masterSchemaFieldId,
    minimum,
    maximum,
    minLength,
    maxLength,
    ...fieldProps
  } = props;

  const numberValidator = async (_, value: unknown) => {
    const valueAsNumber = Number(value);

    if (Number.isNaN(valueAsNumber)) {
      return Promise.reject(`value must be numeric!`);
    }

    if (minimum !== undefined && maximum !== undefined) {
      return valueAsNumber >= minimum && valueAsNumber <= maximum
        ? Promise.resolve()
        : Promise.reject(`value must be between ${minimum} and ${maximum}!`);
    }
    if (minimum !== undefined) {
      valueAsNumber >= minimum ? Promise.resolve() : Promise.reject(`value must be at least ${minimum}!`);
    }
    if (maximum !== undefined) {
      valueAsNumber <= maximum ? Promise.resolve() : Promise.reject(`value cannot be longer than ${maximum}!`);
    }
  };

  switch (fieldProps.fieldType) {
    case DFormFieldTypes.Boolean:
      return (
        <DFormItem
          label={label}
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          valuePropName="checked"
          masterSchemaFieldId={masterSchemaFieldId}
        >
          <DFormBaseField label={label} isRequired={isRequired} isLabelShowing={isLabelShowing} {...fieldProps} />
        </DFormItem>
      );
    case DFormFieldTypes.Text:
    case DFormFieldTypes.TextArea:
    case DFormFieldTypes.LongText:
      return (
        <DFormItem
          label={label}
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
          rules={[{ min: minLength, max: maxLength }]}
        >
          <DFormBaseField isRequired={isRequired} isLabelShowing={isLabelShowing} {...fieldProps} />
        </DFormItem>
      );
    case DFormFieldTypes.Number:
      return (
        <DFormItem
          label={label}
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
          rules={[{ validator: numberValidator }]}
        >
          <DFormBaseField isRequired={isRequired} isLabelShowing={isLabelShowing} {...fieldProps} />
        </DFormItem>
      );
    case DFormFieldTypes.File:
    case DFormFieldTypes.FileList:
      return (
        <DFormItem
          label={label}
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
        >
          <DFormBaseField
            isRequired={isRequired}
            isLabelShowing={isLabelShowing}
            masterSchemaFieldId={masterSchemaFieldId}
            {...fieldProps}
          />
        </DFormItem>
      );
    default:
      return (
        <DFormItem
          label={label}
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
        >
          <DFormBaseField isRequired={isRequired} isLabelShowing={isLabelShowing} {...fieldProps} />
        </DFormItem>
      );
  }
};
