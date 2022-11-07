import React from "react";
import { Form } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";

import { DFormGroup } from "./DFormGroup";
import { DFormBlock } from "../DFormBlock";
import { mockStoriesBlocks } from "../mockStoriesBlocks";
import { DFormBlockSizeTypes, DFormBlockTypes } from "../../types";

export default {
  title: "DForm/Group",
  component: DFormGroup,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Form>
        <DFormGroup groupName={props.groupName}>
          {mockStoriesBlocks.map((blockProps) => (
            <DFormBlock
              id={blockProps.blockId}
              label={blockProps.label}
              helpText={blockProps.helpText}
              blockType={blockProps.blockType}
              blockSize={blockProps.blockSize}
              fieldType={blockProps.fieldType}
              isRequired={blockProps.isRequired}
              isDisabled={blockProps.isDisabled}
              isLabelShowing={blockProps.isLabelShowing}
              masterSchemaFieldId={blockProps.masterSchemaFieldId}
              key={blockProps.blockId}
            />
          ))}

          <DFormBlock
            id="123"
            label="asd"
            helpText="<b>Hello bolding</b>"
            blockType={DFormBlockTypes.HelpText}
            blockSize={DFormBlockSizeTypes.Half}
          />
          <DFormBlock
            id="1234"
            label="asd"
            helpText="<b>Hello bolding</b>"
            blockType={DFormBlockTypes.HelpText}
            blockSize={DFormBlockSizeTypes.Half}
          />
        </DFormGroup>
      </Form>
    </QueryClientProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  groupId: "groupId",
  groupName: "Group name",
};
