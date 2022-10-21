import "./styles.scss";

import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import type { FC } from "react";
import type { DragDropContextProps, DropResult, ResponderProvided } from "react-beautiful-dnd";

import { DFormSections } from "./DFormSections";
import { DFormSchema } from "../types/dformSchema";
import SectionsSideBar from "../Components/SectionsSideBar";

type Props = {
  schema?: DFormSchema;
  selectedElement?: object;
  onSectionCreate?: () => void;
  onFieldCreate?: (groupId: string) => void;
  onGroupCreate?: (sectionId: string) => void;
  onElementClick?: (el: any, type: "field" | "group" | "section") => void;
  onDragEnd?: DragDropContextProps["onDragEnd"];
};

const defaultSchema: DFormSchema = { fields: {}, groups: {}, sections: {}, sectionsOrder: [] };

export const BaseDForm: FC<Props> = (props) => {
  const {
    schema = defaultSchema,
    selectedElement,
    onElementClick,
    onGroupCreate,
    onFieldCreate,
    onSectionCreate,
    onDragEnd: propOnDragEnd,
  } = props;

  const [selectedSectionId, setSelectedSectionId] = useState(() => schema.sectionsOrder[0]);

  const onSectionClick = (sectionId: string) => {
    if (onElementClick) {
      onElementClick(schema.sections[sectionId], "section");
    }
    setSelectedSectionId(sectionId);
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (
      result.destination === null ||
      (result.destination!.index === result.source.index &&
        result.source.droppableId === result.destination!.droppableId)
    )
      return;
    // @ts-ignore
    propOnDragEnd(result);
  };

  return (
    <div className="dform edit-mode">
      <DragDropContext onDragEnd={onDragEnd}>
        <SectionsSideBar
          errors={[]}
          sections={schema.sectionsOrder.map((sectionId) => schema.sections[sectionId])}
          completed={undefined}
          isConfigurable
          selectedSection={selectedSectionId}
          sectionsProgress={{}}
          onSectionCreate={onSectionCreate}
          onSectionSelect={onSectionClick}
        />

        <DFormSections
          schema={schema}
          selectedElement={selectedElement}
          selectedSectionId={selectedSectionId}
          onGroupCreate={onGroupCreate}
          onFieldCreate={onFieldCreate}
          onElementClick={onElementClick}
        />
      </DragDropContext>
    </div>
  );
};
