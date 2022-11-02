import React from "react";
import type { FC } from "react";

import { DFormLabeledBlock } from "../DFormLabeledBlock";
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

type DFormBaseFieldsProps = DFormBooleanProps &
  DFormDatePickerProps &
  DFormFileProps &
  DFormFileListProps &
  DFormLongTextProps &
  DFormMultiSelectProps &
  DFormNumberProps &
  DFormSelectProps &
  DFormTextProps &
  DFormTextAreaProps;

export type DFormFieldProps = DFormBaseFieldsProps & {
  label?: string;
  fieldType: DFormFieldTypes;
  isRequired?: boolean;
  isLabelShowing?: boolean;
};

export const DFormField: FC<DFormFieldProps> = (props) => {
  const { id, label, fieldType, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, ...fieldProps } = props;
  const { value, checked, options, uiStyle, dateFormat, onChange } = fieldProps;

  return (
    <DFormLabeledBlock id={id} label={label} isRequired={isRequired} isLabelShowing={isLabelShowing}>
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
    </DFormLabeledBlock>
  );
};
