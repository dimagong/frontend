import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormBlock } from "./DFormBlock";
import { DformBlockTypes, DformFieldTypes } from "../../data/models";

export default {
  title: "DForm/Block",
  component: DFormBlock,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormBlock
        id={props.id}
        value={props.value}
        label={props.label}
        format={props.format}
        uiStyle={props.uiStyle}
        options={props.options}
        helpText={props.helpText}
        blockType={props.blockType}
        fieldType={props.fieldType}
        isRequired={props.isRequired}
        isDisabled={props.isDisabled}
        isLabelShowing={props.isLabelShowing}
        masterSchemaFieldId={props.masterSchemaFieldId}
        onChange={props.onChange}
      />
    </QueryClientProvider>
  );
};

export const HelpTextBlock = Template.bind({});
HelpTextBlock.args = {
  blockType: DformBlockTypes.HelpText,
  helpText: "<b>Bold+<i>cursive</i></b>",
};

export const FieldBlock = Template.bind({});
FieldBlock.args = {
  id: "field",
  label: "Label",
  value: "Text...",
  fieldType: DformFieldTypes.Text,
  blockType: DformBlockTypes.Field,
};
