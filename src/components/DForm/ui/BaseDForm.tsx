import "./styles.scss";

import React, { FC, useState } from "react";
import { DropResult } from "react-beautiful-dnd";

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
  onReorder?: (result: DropResult) => void;
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
    onReorder,
  } = props;

  const [selectedSectionId, setSelectedSectionId] = useState(() => schema.sectionsOrder[0]);
  const [isDraggable, setIsDraggable] = useState(false);

  const onSectionClick = (sectionId) => {
    if (onElementClick) {
      onElementClick(schema.sections[sectionId], "section");
    }
    setSelectedSectionId(sectionId);
  };

  console.log("isDraggable", isDraggable);

  return (
    <div className="dform edit-mode">
      <SectionsSideBar
        errors={[]}
        sections={schema.sectionsOrder.map((sectionId) => schema.sections[sectionId])}
        completed={undefined}
        isConfigurable
        selectedSection={selectedSectionId}
        sectionsProgress={{}}
        onSectionCreate={onSectionCreate}
        onSectionSelect={onSectionClick}
        onReorder={onReorder}
        isDraggable={isDraggable}
      />

      <DFormSections
        schema={schema}
        selectedElement={selectedElement}
        selectedSectionId={selectedSectionId}
        onGroupCreate={onGroupCreate}
        onFieldCreate={onFieldCreate}
        onElementClick={onElementClick}
        onReorder={onReorder}
        setIsDraggable={setIsDraggable}
      />
    </div>
  );
};
