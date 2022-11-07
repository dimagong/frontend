import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormTemplateEditor } from "./DFormTemplateEditor";

export default {
  title: "DForm/TemplateEditor",
  component: DFormTemplateEditor,
};

const Template = (props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormTemplateEditor
        sections={props.sections}
        isDraggable={props.isDraggable}
        onSectionCreate={props.onSectionCreate}
      />
    </QueryClientProvider>
  );
};

const defaultArgs = {
  isDraggable: false,
};

export const NoSections = Template.bind({});
NoSections.args = {
  ...defaultArgs,
  sections: [],
};

export const Sections = Template.bind({});
Sections.args = {
  ...defaultArgs,
  sections: Array(4)
    .fill(null)
    .map((_, index) => ({ name: `Section ${index}` })),
};
