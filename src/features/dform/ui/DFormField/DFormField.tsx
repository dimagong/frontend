import React from "react";
import type { FC } from "react";

import { invariant } from "features/common";

import { DFormLabeledBlock } from "../DFormLabeledBlock";
import { DFormFieldRenderer, DFormFieldRendererProps } from "./DFormFieldRenderer";

import type { DFormTextProps } from "../DFormText";
import type { DFormFileProps } from "../DFormFile";
import type { DFormFieldTypes } from "../../types";
import type { DFormSelectProps } from "../DFormSelect";
import type { DFormNumberProps } from "../DFormNumber";
import type { DFormBooleanProps } from "../DFormBoolean";
import type { DFormResourceProps } from "../DFormResource";
import type { DFormTextAreaProps } from "../DFormTextArea";
import type { DFormLongTextProps } from "../DFormLongText";
import type { DFormFileListProps } from "../DFormFileList";
import type { DFormDatePickerProps } from "../DFormDatePicker";
import type { DFormMultiSelectProps } from "../DFormMultiSelect";

type DFormFieldsProps = DFormBooleanProps &
  Omit<DFormDatePickerProps, "value"> &
  Omit<DFormFileProps, "value"> &
  Omit<DFormFileListProps, "value"> &
  Omit<DFormLongTextProps, "value"> &
  Omit<DFormMultiSelectProps, "value"> &
  Omit<DFormNumberProps, "value"> &
  Omit<DFormResourceProps, "value"> &
  Omit<DFormSelectProps, "value"> &
  Omit<DFormTextProps, "value"> &
  Omit<DFormTextAreaProps, "value">;

type DFormFieldsValueProp =
  | DFormDatePickerProps["value"]
  | DFormFileProps["value"]
  | DFormFileListProps["value"]
  | DFormLongTextProps["value"]
  | DFormMultiSelectProps["value"]
  | DFormNumberProps["value"]
  | DFormResourceProps["value"]
  | DFormSelectProps["value"]
  | DFormTextProps["value"]
  | DFormTextAreaProps["value"];

export type DFormFieldProps = DFormFieldsProps & {
  label?: string;
  value?: DFormFieldsValueProp;
  fieldType?: DFormFieldTypes;
  isRequired?: boolean;
  isLabelShowing?: boolean;
};

export const DFormField: FC<DFormFieldProps> = (props) => {
  const { id, label, fieldType, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, ...fieldProps } = props;
  const { value, checked, options, uiStyle, format, onChange } = fieldProps;

  invariant(fieldType, "Provide a fieldType to render the <DFormField />");

  return (
    <DFormLabeledBlock id={id} label={label} isRequired={isRequired} isLabelShowing={isLabelShowing}>
      <DFormFieldRenderer
        id={id}
        label={label}
        value={value as never}
        format={format}
        checked={checked}
        options={options}
        uiStyle={uiStyle}
        fieldType={fieldType}
        isDisabled={isDisabled}
        masterSchemaFieldId={masterSchemaFieldId}
        onChange={onChange}
      />
    </DFormLabeledBlock>
  );
};
