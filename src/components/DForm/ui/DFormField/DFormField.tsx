import React from "react";
import type { FC } from "react";

import { DFormLabeledBlock } from "../DFormLabeledBlock";
import { DFormFieldRenderer } from "./DFormFieldRenderer";

import type { DFormTextProps } from "../DFormText";
import type { DFormFileProps } from "../DFormFile";
import type { DFormFieldTypes } from "../../types";
import type { DFormSelectProps } from "../DFormSelect";
import type { DFormNumberProps } from "../DFormNumber";
import type { DFormBooleanProps } from "../DFormBoolean";
import type { DFormTextAreaProps } from "../DFormTextArea";
import type { DFormLongTextProps } from "../DFormLongText";
import type { DFormFileListProps } from "../DFormFileList";
import type { DFormDatePickerProps } from "../DFormDatePicker";
import type { DFormMultiSelectProps } from "../DFormMultiSelect";

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
  fieldType?: DFormFieldTypes;
  isRequired?: boolean;
  isLabelShowing?: boolean;
};

export const DFormField: FC<DFormFieldProps> = (props) => {
  const { id, label, fieldType, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, ...fieldProps } = props;
  const { value, checked, options, uiStyle, dateFormat, onChange } = fieldProps;

  if (fieldType == null) {
    throw new Error("Invariant Violation: Provide a fieldType to render the <DFormField />");
  }

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
