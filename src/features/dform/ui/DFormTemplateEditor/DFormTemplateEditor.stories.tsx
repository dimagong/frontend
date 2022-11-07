import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormTemplateEditor } from "./DFormTemplateEditor";
import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

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

const blockTemplate = [
  {
    id: "0",
    helpText: "<h2>Help text block</h2>",
    blockType: DFormBlockTypes.HelpText,
    blockSize: DFormBlockSizeTypes.Full,
  },
  {
    id: "1",
    label: "Text field",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.Text,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 1,
  },
  {
    id: "2",
    label: "File field",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.File,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 2,
  },
];

const defaultArgs = {
  sections: Array(2)
    .fill(null)
    .map((_, index) => ({
      id: `-s${index}`,
      name: `Section ${index}`,
      relatedGroups: [`-g${index * 3 + 1}`, `-g${index * 3 + 2}`, `-g${index * 3 + 3}`],
    })),

  groups: Array(6)
    .fill(null)
    .map((_, index) => ({
      id: `-g${index + 1}`,
      name: `Group ${index + 1}`,
      relatedBlocks: [`-b${index * 3 + 1}`, `-b${index * 3 + 2}`, `-b${index * 3 + 3}`],
    })),

  blocks: Array(18)
    .fill(null)
    .map((_, index) => {
      const template = blockTemplate[index % 3];
      return {
        ...template,
        id: `-b${index + 1}`,
        ...(template.masterSchemaFieldId ? { masterSchemaFieldId: Number(index + 1) } : {}),
      };
    }),

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
  sections: defaultArgs.sections.map((section) => ({ ...section, relatedGroups: [] })),
};

export const NoBlocks = Template.bind({});
NoBlocks.args = {
  ...defaultArgs,
  groups: defaultArgs.groups.map((group) => ({ ...group, relatedBlocks: [] })),
};

export const Base = Template.bind({});
Base.args = {
  ...defaultArgs,
};
