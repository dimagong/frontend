import React from "react";
import { Form } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";

import { DFormGroup } from "./DFormGroup";
import { DFormBlock } from "../DFormBlock";
import { mockBlocks } from "../../data/models/mockSchema";

export default {
  title: "DForm/Group",
  component: DFormGroup,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Form>
        <DFormGroup groupName={props.groupName}>
          {mockBlocks.map((block) => (
            <DFormBlock {...block} key={block.id} />
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
