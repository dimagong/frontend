import React from "react";
import { Form } from "antd";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormBlock } from "./DFormBlock";
import { DFormBlockTypes, DFormFieldTypes } from "../../types";

export default {
  title: "DFormBlock",
  component: DFormBlock,
};

const Template = (props) => {
  const initialValues = String(props.masterSchemaFieldId) ? { [props.masterSchemaFieldId]: props.value } : {};

  return (
    <Form initialValues={initialValues}>
      <QueryClientProvider client={new QueryClient()}>
        <DFormBlock
          label={props.label}
          helpText={props.helpText}
          blockType={props.blockType}
          fieldType={props.fieldType}
          // isRequired={props.isRequired}
          // isDisabled={props.isDisabled}
          // isLabelShowing={props.isLabelShowing}
          masterSchemaFieldId={props.masterSchemaFieldId}
        />
      </QueryClientProvider>
    </Form>
  );
};

export const HelpTextBlock = Template.bind({});
HelpTextBlock.args = {
  blockType: DFormBlockTypes.HelpText,
  helpText: "<b>Bold+<i>cursive</i></b>",
};

export const ResourceBlock = Template.bind({});
ResourceBlock.args = {
  value: { custom_filename: "Custom.filename", name: "filename.test" },
  blockType: DFormBlockTypes.Resource,
  masterSchemaFieldId: 0,
};

export const FieldBlock = Template.bind({});
FieldBlock.args = {
  label: "Label",
  fieldType: DFormFieldTypes.Text,
  blockType: DFormBlockTypes.Field,
  masterSchemaFieldId: 0,
};
