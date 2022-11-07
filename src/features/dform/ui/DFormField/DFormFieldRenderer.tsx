import React from "react";
import type { FC } from "react";

import { unreachable } from "features/common";

import { DFormFieldTypes } from "../../types";
import { DFormText, DFormTextProps } from "../DFormText";
import { DFormFile, DFormFileProps } from "../DFormFile";
import { DFormSelect, DFormSelectProps } from "../DFormSelect";
import { DFormNumber, DFormNumberProps } from "../DFormNumber";
import { DFormBoolean, DFormBooleanProps } from "../DFormBoolean";
import { DFormTextArea, DFormTextAreaProps } from "../DFormTextArea";
import { DFormFileList, DFormFileListProps } from "../DFormFileList";
import { DFormLongText, DFormLongTextProps } from "../DFormLongText";
import { DFormResource, DFormResourceProps } from "../DFormResource";
import { DFormDatePicker, DFormDatePickerProps } from "../DFormDatePicker";
import { DFormMultiSelect, DFormMultiSelectProps } from "../DFormMultiSelect";

type FieldType<T extends DFormFieldTypes> = { fieldType: T };

type BooleanType = FieldType<DFormFieldTypes.Boolean> & DFormBooleanProps;
type DateType = FieldType<DFormFieldTypes.Date> & DFormDatePickerProps;
type FileType = FieldType<DFormFieldTypes.File> & DFormFileProps;
type FileListType = FieldType<DFormFieldTypes.FileList> & DFormFileListProps;
type LongTextType = FieldType<DFormFieldTypes.LongText> & DFormLongTextProps;
type MultiSelectType = FieldType<DFormFieldTypes.MultiSelect> & DFormMultiSelectProps;
type NumberType = FieldType<DFormFieldTypes.Number> & DFormNumberProps;
type ResourceType = FieldType<DFormFieldTypes.Resource> & DFormResourceProps;
type SelectType = FieldType<DFormFieldTypes.Select> & DFormSelectProps;
type TextType = FieldType<DFormFieldTypes.Text> & DFormTextProps;
type TextAreaType = FieldType<DFormFieldTypes.TextArea> & DFormTextAreaProps;

export type PrivateDFormFieldRendererProps =
  | BooleanType
  | DateType
  | FileType
  | FileListType
  | LongTextType
  | MultiSelectType
  | NumberType
  | ResourceType
  | SelectType
  | TextType
  | TextAreaType;

export type DFormFieldRendererProps = FieldType<DFormFieldTypes> &
  DFormBooleanProps &
  DFormDatePickerProps &
  DFormFileProps &
  DFormFileListProps &
  DFormLongTextProps &
  DFormMultiSelectProps &
  DFormNumberProps &
  DFormResourceProps &
  DFormSelectProps &
  DFormTextProps &
  DFormTextAreaProps;

export const DFormFieldRenderer: FC<DFormFieldRendererProps> = (props: PrivateDFormFieldRendererProps) => {
  switch (props.fieldType) {
    case DFormFieldTypes.Boolean:
      return (
        <DFormBoolean
          id={props.id}
          value={props.value}
          label={props.label}
          isDisabled={props.isDisabled}
          onChange={props.onChange}
        />
      );
    case DFormFieldTypes.Date:
      return (
        <DFormDatePicker
          id={props.id}
          value={props.value}
          format={props.format}
          isDisabled={props.isDisabled}
          onChange={props.onChange}
        />
      );
    case DFormFieldTypes.File:
      return (
        <DFormFile
          id={props.id}
          value={props.value}
          isDisabled={props.isDisabled}
          masterSchemaFieldId={props.masterSchemaFieldId}
          onChange={props.onChange}
        />
      );
    case DFormFieldTypes.FileList:
      return (
        <DFormFileList
          id={props.id}
          value={props.value}
          isDisabled={props.isDisabled}
          masterSchemaFieldId={props.masterSchemaFieldId}
          onChange={props.onChange}
        />
      );
    case DFormFieldTypes.LongText:
      return <DFormLongText value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />;
    case DFormFieldTypes.MultiSelect:
      return (
        <DFormMultiSelect
          id={props.id}
          value={props.value}
          uiStyle={props.uiStyle}
          options={props.options}
          isDisabled={props.isDisabled}
          onChange={props.onChange}
        />
      );
    case DFormFieldTypes.Number:
      return <DFormNumber id={props.id} value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />;
    case DFormFieldTypes.Resource:
      return (
        <DFormResource
          value={props.value}
          isDisabled={props.isDisabled}
          masterSchemaFieldId={props.masterSchemaFieldId}
        />
      );
    case DFormFieldTypes.Select:
      return (
        <DFormSelect
          id={props.id}
          value={props.value}
          options={props.options}
          isDisabled={props.isDisabled}
          onChange={props.onChange}
        />
      );
    case DFormFieldTypes.Text:
      return <DFormText id={props.id} value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />;
    case DFormFieldTypes.TextArea:
      return (
        <DFormTextArea id={props.id} value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />
      );
    default:
      unreachable(`Field type is not supported.`);
  }
};
