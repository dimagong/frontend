import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormGroup } from "../DFormGroup";
import { DFormBlock } from "../DFormBlock";
import { DFormSection } from "./DFormSection";
import { mockBlocks, mockGroups } from "../../data/models/mockSchema";

export default {
  title: "DForm/Section",
  component: DFormSection,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormSection sectionName={props.sectionName}>
        {mockGroups.map((group) => (
          <DFormGroup groupName={group.name} key={group.id}>
            {group.relatedBlocksIds
              .slice(0, group.relatedBlocksIds.length / 3)
              .map((blockId) => mockBlocks.find((block) => block.id === blockId)!)
              .map((block) => (
                <DFormBlock {...block} key={block.id} />
              ))}
          </DFormGroup>
        ))}
      </DFormSection>
    </QueryClientProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  sectionName: "Section name",
};
