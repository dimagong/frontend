import React from "react";
import { Form } from "antd";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormField } from "./DFormField";
import { DFormFieldTypes } from "../../types";
import { DFormFieldItem } from "./DFormFieldItem";

export default {
  title: "DFormField",
  component: DFormField,
};

const Template = (props) => {
  return (
    <Form initialValues={{ [props.masterSchemaFieldId]: props.value }}>
      <QueryClientProvider client={new QueryClient()}>
        <DFormFieldItem
          minimum={props.minimum}
          maximum={props.maximum}
          minLength={props.minLength}
          maxLength={props.maxLength}
          fieldType={props.fieldType}
          isRequired={props.isRequired}
          masterSchemaFieldId={props.masterSchemaFieldId}
        >
          <DFormField
            id={String(props.masterSchemaFieldId)}
            label={props.label}
            options={props.options}
            uiStyle={props.uiStyle}
            fieldType={props.fieldType}
            isDisabled={props.isDisabled}
            isRequired={props.isRequired}
            isLabelShowing={props.isLabelShowing}
            masterSchemaFieldId={props.masterSchemaFieldId}
            onChange={props.onChange}
          />
        </DFormFieldItem>
      </QueryClientProvider>
    </Form>
  );
};

const defaultArgs = {
  label: "Label",
  isDisabled: false,
  isRequired: false,
  isLabelShowing: true,
  masterSchemaFieldId: 0,
};

export const BooleanField = Template.bind({});
BooleanField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Boolean,
  value: true,
};

export const DateField = Template.bind({});
DateField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Date,
  value: new Date().toISOString(),
};

export const FileField = Template.bind({});
FileField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.File,
  value: [{ name: "Filename.test", file_id: 0 }],
};

export const FileListField = Template.bind({});
FileListField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.FileList,
  value: [
    { name: "Filename.test", file_id: 0 },
    { name: "test.file", file_id: 1 },
  ],
};

export const LongTextField = Template.bind({});
LongTextField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.LongText,
  value: "<b>Bold</b>",
  minLength: 10,
  maxLength: 20,
};

export const MultiSelectField = Template.bind({});
MultiSelectField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.MultiSelect,
  value: ["option 1", "option 2"],
  options: ["option 1", "option 2", "option 3", "option 4"],
};

export const NumberField = Template.bind({});
NumberField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Number,
  value: 877,
  minimum: 877,
  maximum: 879,
};

export const SelectField = Template.bind({});
SelectField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Select,
  value: "option 1",
  options: ["option 1", "option 2", "option 3", "option 4"],
};

export const TextField = Template.bind({});
TextField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Text,
  value: "text...",
  minLength: 10,
  maxLength: 15,
};

export const TextAreaField = Template.bind({});
TextAreaField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.TextArea,
  value: "more text...",
  minLength: 30,
  maxLength: 35,
};
