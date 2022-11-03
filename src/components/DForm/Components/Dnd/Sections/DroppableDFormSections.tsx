import React from "react";
import type { FC } from "react";
import { TabContent, TabPane } from "reactstrap";
import { Droppable } from "react-beautiful-dnd";

import { HolderOutlined } from "@ant-design/icons";

import { DFormSchema } from "components/DForm/types/dformSchema";
import { useDFormContext } from "components/DForm/DFormContext";
import { ElementTypes } from "components/DForm/types/elementTypes";
import { DroppableDFormSection } from "./DroppableDFormSection";

type Props = {
  schema: DFormSchema;
  selectedElement?: any;
  selectedSectionId: string;
  onGroupCreate?: (sectionId: string) => void;
  onFieldCreate?: (groupId: string) => void;
  onElementClick?: (el: any, type: "field" | "group" | "section") => void;
  isCollapsed?: boolean;
};

export const DroppableDFormSections: FC<Props> = (props) => {
  const { schema, selectedSectionId, selectedElement, onElementClick, onGroupCreate, onFieldCreate, isCollapsed } =
    props;

  const { isConfigurable } = useDFormContext();

  if (!schema.sections || Object.keys(schema.sections).length === 0) {
    if (isConfigurable) {
      return (
        <div className="px-2 py-5 text-center w-100">
          There are no available sections <br />
          <br />
          create one by clicking "New Tab" button, to start editing your application
        </div>
      );
    } else {
      return <div className="px-2 py-5 text-center w-100">This application is empty</div>;
    }
  }

  return (
    <TabContent activeTab={selectedSectionId} className="w-100">
      {schema.sectionsOrder.map((sectionId) => {
        const { id, isHidden, isDisabled, relatedGroups } = schema.sections[sectionId];

        return (
          <TabPane tabId={id} key={id}>
            <Droppable
              droppableId={id}
              type={ElementTypes.Group}
              key={id}
              renderClone={(provided, snapshot, rubric) => (
                <div {...provided.draggableProps} ref={provided.innerRef}>
                  <div className="dform-dnd__wrapper">
                    <span className="dform-dnd__drag-handle-icon" {...provided.dragHandleProps}>
                      <HolderOutlined style={{ paddingTop: "2px" }} />
                    </span>
                    <div className="group-title group-title--draggable">
                      <span className="text-bold-500">{schema.groups[rubric.draggableId].name}</span>
                    </div>
                  </div>
                </div>
              )}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {isHidden ? null : (
                    <DroppableDFormSection
                      id={id}
                      schema={schema}
                      isHidden={isHidden}
                      isDisabled={isDisabled}
                      relatedGroups={relatedGroups}
                      selectedElement={selectedElement}
                      onFieldCreate={onFieldCreate}
                      onGroupCreate={onGroupCreate}
                      onElementClick={onElementClick}
                      isCollapsed={isCollapsed}
                    />
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </TabPane>
        );
      })}
    </TabContent>
  );
};
