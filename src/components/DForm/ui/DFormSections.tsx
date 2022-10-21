import React from "react";
import type { FC } from "react";
import { TabContent, TabPane } from "reactstrap";
import { Droppable } from "react-beautiful-dnd";

import { DragIndicator } from "@material-ui/icons";

import { DFormSection } from "./DFormSection";
import { useDFormContext } from "../DFormContext";
import { DFormSchema } from "../types/dformSchema";
import { ElementTypes } from "../types/elementTypes";

type Props = {
  schema: DFormSchema;
  selectedElement?: any;
  selectedSectionId: string;
  onGroupCreate?: (sectionId: string) => void;
  onFieldCreate?: (groupId: string) => void;
  onElementClick?: (el: any, type: "field" | "group" | "section") => void;
};

export const DFormSections: FC<Props> = (props) => {
  const { schema, selectedSectionId, selectedElement, onElementClick, onGroupCreate, onFieldCreate } = props;

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
              renderClone={(provided, snapshot, rubric) => (
                <div {...provided.draggableProps} ref={provided.innerRef}>
                  {console.log("snapshot", snapshot)}
                  <div className="draggable-wrapper">
                    <span
                      className="nested-draggable-list_item-drag-icon group-drag-icon"
                      {...provided.dragHandleProps}
                    >
                      <DragIndicator />
                    </span>
                    <div className={"group-title group-title--draggable"}>
                      <span className="text-bold-500">{schema.groups[rubric.draggableId].name}</span>
                    </div>
                  </div>
                </div>
              )}
              key={id}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {isHidden ? null : (
                    <DFormSection
                      id={id}
                      schema={schema}
                      isHidden={isHidden}
                      isDisabled={isDisabled}
                      relatedGroups={relatedGroups}
                      selectedElement={selectedElement}
                      onFieldCreate={onFieldCreate}
                      onGroupCreate={onGroupCreate}
                      onElementClick={onElementClick}
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
