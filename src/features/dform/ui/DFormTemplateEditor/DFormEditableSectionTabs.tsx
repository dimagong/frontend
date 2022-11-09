import React from "react";
import type { FC, ReactNode } from "react";

import { DformElementId, DformSectionId } from "../../data/models";

import { DFormTabs } from "../DFormTabs";
import { DformSchemaContext } from "../DformSchemaContext";

export type DFormTemplateEditorProps = {
  isDraggable?: boolean;
  selectedElementId?: DformElementId;
  relatedSectionsIds: DformSectionId[];
  onSectionClick?: (sectionId: DformSectionId) => void;
  onSectionCreate?: () => void;
  children: (sectionId: DformSectionId) => ReactNode;
};

export const DFormEditableSectionTabs: FC<DFormTemplateEditorProps> = (props) => {
  const { isDraggable, selectedElementId, relatedSectionsIds, onSectionClick, onSectionCreate, children } = props;

  const { dformSchema } = DformSchemaContext.useContext();
  const orderedSections = relatedSectionsIds.map((sectionId) => dformSchema.getSectionById(sectionId));

  return (
    <DFormTabs
      items={orderedSections.map((section) => ({
        key: section.id,
        label: section.name,
        children: children(section.id),
      }))}
      isDraggable={isDraggable}
      selectedElementId={selectedElementId}
      onTabClick={onSectionClick}
      onTabCreate={onSectionCreate}
    />
  );
};
