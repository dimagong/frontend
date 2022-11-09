import { Form } from "antd";
import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormField } from "../DFormField";
import { DFormFieldItem } from "./DFormFieldItem";
import { DformFieldTypes } from "../../data/models";

export default {
  title: "DForm/FieldItem",
  component: DFormFieldItem,
};

const Template = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    props.value ? form.setFieldValue(props.name, props.value) : form.resetFields();
  }, [props.value]);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Form form={form}>
        <DFormFieldItem
          name={props.name}
          minimum={props.minimum}
          maximum={props.maximum}
          minLength={props.minLength}
          maxLength={props.maxLength}
          isRequired={props.isRequired}
        >
          <DFormField
            id={props.id}
            label={props.label}
            fieldType={props.fieldType}
            isRequired={props.isRequired}
            onChange={props.onChange}
          />
        </DFormFieldItem>
      </Form>
    </QueryClientProvider>
  );
};

const defaultArgs = {
  id: "field_id",
  name: "field-name",
  label: "Label",
  isRequired: false,
};

export const Required = Template.bind({});
Required.args = {
  ...defaultArgs,
  isRequired: true,
  fieldType: DformFieldTypes.Text,
  value: "text...",
};

export const MinimumMaximum = Template.bind({});
MinimumMaximum.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Number,
  value: 877,
  minimum: 876,
  maximum: 879,
};

export const MinMaxLength = Template.bind({});
MinMaxLength.args = {
  ...defaultArgs,
  fieldType: DformFieldTypes.Text,
  value: "text...",
  minLength: 10,
  maxLength: 20,
};
