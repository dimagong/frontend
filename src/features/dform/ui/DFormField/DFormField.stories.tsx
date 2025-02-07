import { Form } from "antd";
import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormField } from "./DFormField";
import { DformFieldTypes } from "../../data/models";

export default {
  title: "DForm/Field",
  component: DFormField,
};

const Template = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    props.value ? form.setFieldValue("field", props.value) : form.resetFields();
  }, [props.value]);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Form form={form}>
        <Form.Item name="field">
          <DFormField
            id={props.id}
            label={props.label}
            format={props.format}
            options={props.options}
            uiStyle={props.uiStyle}
            fieldType={props.fieldType}
            isDisabled={props.isDisabled}
            isRequired={props.isRequired}
            isLabelShowing={props.isLabelShowing}
            masterSchemaFieldId={props.masterSchemaFieldId}
            onChange={props.onChange}
          />
        </Form.Item>
      </Form>
    </QueryClientProvider>
  );
};

const defaultArgs = {
  id: "field_id",
  label: "Label",
  isDisabled: false,
  isRequired: false,
  isLabelShowing: true,
};

export const BooleanField = Template.bind({});
BooleanField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Boolean,
  value: true,
};

export const DateField = Template.bind({});
DateField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Date,
  value: new Date().toISOString(),
};

export const FileField = Template.bind({});
FileField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.File,
  value: [{ name: "Filename.test", file_id: 0 }],
};

export const FileListField = Template.bind({});
FileListField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.FileList,
  value: [
    { name: "Filename.test", file_id: 0 },
    { name: "test.file", file_id: 1 },
  ],
};

export const LongTextField = Template.bind({});
LongTextField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.LongText,
  value: "<b>Bold</b>",
};

export const MultiSelectField = Template.bind({});
MultiSelectField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.MultiSelect,
  value: ["option 1", "option 2"],
  options: ["option 1", "option 2", "option 3", "option 4"],
};

export const NumberField = Template.bind({});
NumberField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Number,
  value: 877,
};

export const ResourceField = Template.bind({});
ResourceField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Resource,
  value: { custom_filename: "Custom.test", name: "Filename.test", file_id: 0 },
};

export const SelectField = Template.bind({});
SelectField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Select,
  value: "option 1",
  options: ["option 1", "option 2", "option 3", "option 4"],
};

export const TextField = Template.bind({});
TextField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Text,
  value: "text...",
};

export const TextAreaField = Template.bind({});
TextAreaField.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.TextArea,
  value: "more text...",
};
