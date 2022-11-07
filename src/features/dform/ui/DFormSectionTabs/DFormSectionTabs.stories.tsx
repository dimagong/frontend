import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

import { DFormSectionTabs } from "./DFormSectionTabs";

export default {
  title: "DForm/SectionTabs",
  component: DFormSectionTabs,
};

const Template = (props) => {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <DFormSectionTabs items={props.sections} isDraggable={props.isDraggable} onCreate={props.onCreate} />
    </DragDropContext>
  );
};

export const Empty = Template.bind({});
Empty.args = {
  sections: [],
  isDraggable: false,
};

export const Base = Template.bind({});
Base.args = {
  sections: Array(4)
    .fill(null)
    .map((_, index) => ({ label: `Section ${index}`, key: String(index) })),
  isDraggable: false,
};
