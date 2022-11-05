import React from "react";
import { Form } from "antd";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormGroup } from "./DFormGroup";
import { DFormBlock } from "../DFormBlock";
import { mockStoriesBlocks } from "./mockStoriesBlocks";

export default {
  title: "DForm/Group",
  component: DFormGroup,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Form>
        <DFormGroup groupId={props.groupId} groupName={props.groupName}>
          {mockStoriesBlocks.map((blockProps) => (
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
              key={blockProps.blockId}
            />
          ))}
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
