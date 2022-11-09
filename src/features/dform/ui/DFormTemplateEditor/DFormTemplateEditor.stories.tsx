import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormTemplateEditor } from "./DFormTemplateEditor";
import { mockSections, mockGroups, mockBlocks } from "../../data/models/mockSchema";

export default {
  title: "DForm/TemplateEditor",
  component: DFormTemplateEditor,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormTemplateEditor
        blocks={props.blocks}
        groups={props.groups}
        sections={props.sections}
        relatedSectionsIds={props.sections.map(({ id }) => id)}
        isDraggable={props.isDraggable}
        selectedElementId={props.selectedElementId}
        onDragEnd={props.onDragEnd}
        onBlockClick={props.onBlockClick}
        onGroupClick={props.onGroupClick}
        onBlockCreate={props.onBlockCreate}
        onGroupCreate={props.onGroupCreate}
        onSectionClick={props.onSectionClick}
        onSectionCreate={props.onSectionCreate}
      />
    </QueryClientProvider>
  );
};

const defaultArgs = {
  blocks: mockBlocks,
  groups: mockGroups,
  sections: mockSections,
  isDraggable: false,
};

export const NoSections = Template.bind({});
NoSections.args = {
  ...defaultArgs,
  sections: [],
};

export const NoGroups = Template.bind({});
NoGroups.args = {
  ...defaultArgs,
  sections: defaultArgs.sections.map((section) => ({ ...section, relatedGroupsIds: [] })),
  groups: [],
  blocks: [],
};

export const NoBlocks = Template.bind({});
NoBlocks.args = {
  ...defaultArgs,
  groups: defaultArgs.groups.map((group) => ({ ...group, relatedBlocksIds: [] })),
  blocks: [],
};

export const Base = Template.bind({});
Base.args = {
  ...defaultArgs,
};
