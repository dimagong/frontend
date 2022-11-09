import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

import { DFormTabs } from "./DFormTabs";

export default {
  title: "DForm/Tabs",
  component: DFormTabs,
};

const Template = (props) => {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <DFormTabs
        items={props.sections}
        isDraggable={props.isDraggable}
        selectedElementId={props.selectedElementId}
        onTabClick={props.onTabClick}
        onTabCreate={props.onTabCreate}
      />
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
