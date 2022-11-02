import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormFieldTypes } from "../../types";
import { DFormEditableField } from "./DFormEditableField";

export default {
  title: "DFormEditableField",
  component: DFormEditableField,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormEditableField
        value={props.value}
        label={props.label}
        fieldId={props.fieldId}
        fieldType={props.fieldType}
        isRequired={props.isRequired}
        isDisabled={props.isDisabled}
        isLabelShowing={props.isLabelShowing}
      />
    </QueryClientProvider>
  );
};

const defaultArgs = {
  label: "Label",
  isDisabled: false,
  isRequired: false,
  isLabelShowing: true,
};

export const BooleanField = Template.bind({});
BooleanField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Boolean,
};

export const DateField = Template.bind({});
DateField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Date,
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
};

export const MultiSelectField = Template.bind({});
MultiSelectField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.MultiSelect,
  options: ["option 1", "option 2", "option 3", "option 4"],
};

export const NumberField = Template.bind({});
NumberField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Number,
};

export const SelectField = Template.bind({});
SelectField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Select,
  options: ["option 1", "option 2", "option 3", "option 4"],
};

export const TextField = Template.bind({});
TextField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.Text,
};

export const TextAreaField = Template.bind({});
TextAreaField.args = {
  ...defaultArgs,
  fieldType: DFormFieldTypes.TextArea,
};
