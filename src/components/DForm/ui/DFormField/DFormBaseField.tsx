import React from "react";
import type { CSSProperties, FC } from "react";

import { DFormLabeledItem } from "../DFormLabeledItem";
import { DFormFieldRenderer } from "./DFormFieldRenderer";

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
import type { DFormFieldTypes } from "../../types";

type DFormBaseFieldsProps = Omit<DFormBooleanProps, "id" | "label" | "isDisabled"> &
  Omit<DFormDatePickerProps, "id" | "isDisabled"> &
  Omit<DFormFileProps, "id" | "isDisabled" | "masterSchemaFieldId"> &
  Omit<DFormFileListProps, "id" | "isDisabled" | "masterSchemaFieldId"> &
  Omit<DFormLongTextProps, "id" | "isDisabled"> &
  Omit<DFormMultiSelectProps, "id" | "isDisabled"> &
  Omit<DFormNumberProps, "id" | "isDisabled"> &
  Omit<DFormSelectProps, "id" | "isDisabled"> &
  Omit<DFormTextProps, "id" | "isDisabled"> &
  Omit<DFormTextAreaProps, "id" | "isDisabled">;

export type DFormBaseFieldProps = DFormBaseFieldsProps & {
  id?: string;
  label?: string;
  fieldType: DFormFieldTypes;
  isRequired: boolean;
  isDisabled: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId?: number;
  style?: CSSProperties;
  className?: string;
};

export const DFormBaseField: FC<DFormBaseFieldProps> = (props) => {
  const {
    id,
    label,
    fieldType,
    isRequired,
    isDisabled,
    isLabelShowing,
    masterSchemaFieldId,
    style,
    className,
    ...fieldProps
  } = props;
  const { value, checked, options, uiStyle, dateFormat, onChange } = fieldProps;

  return (
    <DFormLabeledItem
      id={id}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <DFormFieldRenderer
        id={id}
        label={label}
        value={value}
        checked={checked}
        options={options}
        uiStyle={uiStyle}
        fieldType={fieldType}
        dateFormat={dateFormat}
        isDisabled={isDisabled}
        masterSchemaFieldId={masterSchemaFieldId}
        onChange={onChange}
      />
    </DFormLabeledItem>
  );
};
