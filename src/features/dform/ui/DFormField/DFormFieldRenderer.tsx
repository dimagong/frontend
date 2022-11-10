import React from "react";
import type { FC } from "react";

import { unreachable } from "features/common";

import { DformFieldTypes } from "../../data/models";
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

type FieldType<T extends DformFieldTypes> = { fieldType: T };

type BooleanType = FieldType<DformFieldTypes.Boolean> & DFormBooleanProps;
type DateType = FieldType<DformFieldTypes.Date> & DFormDatePickerProps;
type FileType = FieldType<DformFieldTypes.File> & DFormFileProps;
type FileListType = FieldType<DformFieldTypes.FileList> & DFormFileListProps;
type LongTextType = FieldType<DformFieldTypes.LongText> & DFormLongTextProps;
type MultiSelectType = FieldType<DformFieldTypes.MultiSelect> & DFormMultiSelectProps;
type NumberType = FieldType<DformFieldTypes.Number> & DFormNumberProps;
type ResourceType = FieldType<DformFieldTypes.Resource> & DFormResourceProps;
type SelectType = FieldType<DformFieldTypes.Select> & DFormSelectProps;
type TextType = FieldType<DformFieldTypes.Text> & DFormTextProps;
type TextAreaType = FieldType<DformFieldTypes.TextArea> & DFormTextAreaProps;

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

export type DFormFieldRendererProps = FieldType<DformFieldTypes> &
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
    case DformFieldTypes.Boolean:
      return (
        <DFormBoolean
          id={props.id}
          value={props.value}
          label={props.label}
          isDisabled={props.isDisabled}
          onChange={props.onChange}
        />
      );
    case DformFieldTypes.Date:
      return (
        <DFormDatePicker
          id={props.id}
          value={props.value}
          format={props.format}
          isDisabled={props.isDisabled}
          onChange={props.onChange}
        />
      );
    case DformFieldTypes.File:
      return (
        <DFormFile
          id={props.id}
          value={props.value}
          isDisabled={props.isDisabled}
          masterSchemaFieldId={props.masterSchemaFieldId}
          onChange={props.onChange}
        />
      );
    case DformFieldTypes.FileList:
      return (
        <DFormFileList
          id={props.id}
          value={props.value}
          isDisabled={props.isDisabled}
          masterSchemaFieldId={props.masterSchemaFieldId}
          onChange={props.onChange}
        />
      );
    case DformFieldTypes.LongText:
      return <DFormLongText value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />;
    case DformFieldTypes.MultiSelect:
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
    case DformFieldTypes.Number:
      return <DFormNumber id={props.id} value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />;
    case DformFieldTypes.Resource:
      return (
        <DFormResource
          value={props.value}
          isDisabled={props.isDisabled}
          masterSchemaFieldId={props.masterSchemaFieldId}
        />
      );
    case DformFieldTypes.Select:
      return (
        <DFormSelect
          id={props.id}
          value={props.value}
          options={props.options}
          isDisabled={props.isDisabled}
          onChange={props.onChange}
        />
      );
    case DformFieldTypes.Text:
      return <DFormText id={props.id} value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />;
    case DformFieldTypes.TextArea:
      return (
        <DFormTextArea id={props.id} value={props.value} isDisabled={props.isDisabled} onChange={props.onChange} />
      );
    default:
      unreachable(`Field type is not supported.`);
  }
};
