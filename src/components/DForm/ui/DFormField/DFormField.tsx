import React from "react";
import type { FC } from "react";

import { DFormItem } from "../DFormItem";
import { DFormBaseField, DFormBaseFieldProps } from "./DFormBaseField";

import { DFormFieldTypes } from "../../types";

type Props = Omit<DFormBaseFieldProps, "masterSchemaFieldId"> & {
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  masterSchemaFieldId: number;
};

export const DFormField: FC<Props> = (props) => {
  const { minimum, maximum, minLength, maxLength, ...fieldProps } = props;
  const {
    value,
    label,
    checked,
    options,
    uiStyle,
    fieldType,
    dateFormat,
    isRequired,
    isDisabled,
    isLabelShowing,
    masterSchemaFieldId,
    onChange,
  } = fieldProps;

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
