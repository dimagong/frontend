import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormGroup } from "./DFormGroup";
import { DFormBlock } from "../DFormBlock";
import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

export default {
  title: "DFormGroup",
  component: DFormGroup,
};

const blocks = [
  {
    helpText: "<h2>Help text block</h2>",
    blockType: DFormBlockTypes.HelpText,
    blockSize: DFormBlockSizeTypes.Full,
  },
  {
    label: "Resource block",
    blockType: DFormBlockTypes.Resource,
    blockSize: DFormBlockSizeTypes.Half,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 0,
  },
  {
    label: "Text field",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.Text,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 1,
  },
];

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormGroup groupId={props.groupId} groupName={props.groupName}>
        {blocks.map((blockProps) => (
          <DFormBlock
            label={blockProps.label}
            helpText={blockProps.helpText}
            blockType={blockProps.blockType}
            fieldType={blockProps.fieldType}
            blockSize={blockProps.blockSize}
            isRequired={blockProps.isRequired}
            isDisabled={blockProps.isDisabled}
            isLabelShowing={blockProps.isLabelShowing}
            masterSchemaFieldId={blockProps.masterSchemaFieldId}
          />
        ))}
      </DFormGroup>
    </QueryClientProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  groupId: "groupId",
  groupName: "Group name",
};
