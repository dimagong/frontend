import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormGroup } from "../DFormGroup";
import { DFormBlock } from "../DFormBlock";
import { DFormSection } from "./DFormSection";
import { mockStoriesGroups } from "../mockStoriesGroups";
import { mockStoriesBlocks } from "../mockStoriesBlocks";

export default {
  title: "DForm/Section",
  component: DFormSection,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormSection sectionName={props.sectionName}>
        {mockStoriesGroups.map((groupProps) => (
          <DFormGroup groupName={groupProps.groupName} key={groupProps.groupId}>
            {mockStoriesBlocks
              .map((block, blockIndex) => ({
                ...block,
                blockId: groupProps.relatedBlocks[blockIndex],
                ...(block.masterSchemaFieldId
                  ? { masterSchemaFieldId: Number(groupProps.relatedBlocks[blockIndex]) }
                  : {}),
              }))
              .map((blockProps) => (
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
        ))}
      </DFormSection>
    </QueryClientProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  sectionName: "Section name",
};
