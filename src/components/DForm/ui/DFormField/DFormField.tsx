import React from "react";
import type { FC } from "react";

import { DFormItem } from "../DFormItem";
import { DFormBaseField } from "./DFormBaseField";

import { DFormFieldTypes } from "../../types";
import type { DFormBooleanProps } from "../DFormBoolean";
import type { DFormDatePickerProps } from "../DFormDatePicker";
import type { DFormFileProps } from "../DFormFile";
import type { DFormFileListProps } from "../DFormFileList";
import type { DFormLongTextProps } from "../DFormLongText";
import type { DFormMultiSelectProps } from "../DFormMultiSelect";
import type { DFormNumberProps } from "../DFormNumber";
import type { DFormSelectProps } from "../DFormSelect";
import type { DFormTextProps } from "../DFormText";
import type { DFormTextAreaProps } from "../DFormTextArea";

export type DFormBaseField = Omit<DFormBooleanProps, "id" | "label" | "isDisabled"> &
  Omit<DFormDatePickerProps, "id" | "isDisabled"> &
  Omit<DFormFileProps, "id" | "isDisabled" | "masterSchemaFieldId"> &
  Omit<DFormFileListProps, "id" | "isDisabled" | "masterSchemaFieldId"> &
  Omit<DFormLongTextProps, "id" | "isDisabled"> &
  Omit<DFormMultiSelectProps, "id" | "isDisabled"> &
  Omit<DFormNumberProps, "id" | "isDisabled"> &
  Omit<DFormSelectProps, "id" | "isDisabled"> &
  Omit<DFormTextProps, "id" | "isDisabled"> &
  Omit<DFormTextAreaProps, "id" | "isDisabled">;

type Props = DFormBaseField & {
  label?: string;
  fieldType: DFormFieldTypes;
  isRequired: boolean;
  isDisabled: boolean;
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
    fieldType,
    isRequired,
    isDisabled,
    isLabelShowing,
    masterSchemaFieldId,
    minimum,
    maximum,
    minLength,
    maxLength,
    ...fieldProps
  } = props;
  const { onChange, checked, value, options, uiStyle, dateFormat } = fieldProps;

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

  const Field = (
    <DFormBaseField
      id={String(masterSchemaFieldId)}
      label={label}
      value={value}
      checked={checked}
      options={options}
      uiStyle={uiStyle}
      fieldType={fieldType}
      dateFormat={dateFormat}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      masterSchemaFieldId={masterSchemaFieldId}
      onChange={onChange}
      {...fieldProps}
    />
  );

  switch (fieldType) {
    case DFormFieldTypes.Boolean:
      return (
        <DFormItem
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          valuePropName="checked"
          masterSchemaFieldId={masterSchemaFieldId}
        >
          {Field}
        </DFormItem>
      );
    case DFormFieldTypes.Text:
    case DFormFieldTypes.TextArea:
    case DFormFieldTypes.LongText:
      return (
        <DFormItem
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
          rules={[{ min: minLength, max: maxLength }]}
        >
          {Field}
        </DFormItem>
      );
    case DFormFieldTypes.Number:
      return (
        <DFormItem
          isRequired={isRequired}
          isLabelShowing={isLabelShowing}
          masterSchemaFieldId={masterSchemaFieldId}
          rules={[{ validator: numberValidator }]}
        >
          {Field}
        </DFormItem>
      );
    default:
      return (
        <DFormItem isRequired={isRequired} isLabelShowing={isLabelShowing} masterSchemaFieldId={masterSchemaFieldId}>
          {Field}
        </DFormItem>
      );
  }
};
