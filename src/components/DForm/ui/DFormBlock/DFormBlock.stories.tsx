import React from "react";
import { Form } from "antd";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormBlock } from "./DFormBlock";
import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

export default {
  title: "DFormBlock",
  component: DFormBlock,
};

const Template = (props) => {
  const initialValues = String(props.masterSchemaFieldId) ? { [props.masterSchemaFieldId]: props.value } : {};

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Form initialValues={initialValues}>
        <DFormBlock
          label={props.label}
          uiStyle={props.uiStyle}
          options={props.options}
          helpText={props.helpText}
          blockType={props.blockType}
          fieldType={props.fieldType}
          blockSize={props.blockSize}
          isRequired={props.isRequired}
          isDisabled={props.isDisabled}
          isLabelShowing={props.isLabelShowing}
          masterSchemaFieldId={props.masterSchemaFieldId}
        />
      </Form>
    </QueryClientProvider>
  );
};

const defaultArgs = {
  blockSize: DFormBlockSizeTypes.Full,
};

export const HelpTextBlock = Template.bind({});
HelpTextBlock.args = {
  ...defaultArgs,
  blockType: DFormBlockTypes.HelpText,
  helpText: "<b>Bold+<i>cursive</i></b>",
};

export const ResourceBlock = Template.bind({});
ResourceBlock.args = {
  ...defaultArgs,
  label: "Label",
  value: { custom_filename: "Custom.filename", name: "filename.test" },
  blockType: DFormBlockTypes.Resource,
  masterSchemaFieldId: 0,
};

export const FieldBlock = Template.bind({});
FieldBlock.args = {
  ...defaultArgs,
  label: "Label",
  fieldType: DFormFieldTypes.Text,
  blockType: DFormBlockTypes.Field,
  masterSchemaFieldId: 0,
};
