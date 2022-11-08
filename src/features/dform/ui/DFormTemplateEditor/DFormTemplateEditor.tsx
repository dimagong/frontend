import React from "react";
import type { FC } from "react";
import { DragDropContext, DragDropContextProps } from "react-beautiful-dnd";

import { NmpCol, NmpRow } from "features/nmp-ui";

import { DFormSectionElement } from "../../types";
import { DFormTemplateSectionEditor } from "./DFormTemplateSectionEditor";
import { DFormSectionTabs, DFormSectionTabsProps } from "../DFormSectionTabs";

type Item = Unpack<DFormSectionTabsProps["items"]>;

export type DFormTemplateEditorProps = {
  blocks: any[];
  groups: any[];
  sections: DFormSectionElement[];
  isDraggable?: boolean;
  selectedElementId?: string;
  onDragEnd?: DragDropContextProps["onDragEnd"];
  onBlockClick?: (blockId: string) => void;
  onGroupClick?: (groupId: string) => void;
  onBlockCreate?: (groupId: string, blockId?: string) => void;
  onGroupCreate?: (sectionId: string) => void;
  onSectionClick?: (sectionId: string) => void;
  onSectionCreate?: () => void;
};

export const DFormTemplateEditor: FC<DFormTemplateEditorProps> = (props) => {
  const {
    blocks,
    groups,
    sections,
    isDraggable,
    selectedElementId,
    onDragEnd = () => {},
    onBlockClick,
    onGroupClick,
    onBlockCreate,
    onGroupCreate,
    onSectionClick,
    onSectionCreate,
  } = props;

  const node = (
    <NmpRow>
      <NmpCol span="24">
        <DFormSectionTabs
          items={sections.map(
            (section: DFormSectionElement): Item => ({
              key: section.id,
              label: section.name,
              children: (
                <DFormTemplateSectionEditor
                  blocks={blocks}
                  groups={groups}
                  sectionId={section.id}
                  sectionName={section.name}
                  isDraggable={isDraggable}
                  relatedGroups={section.relatedGroups}
                  selectedElementId={selectedElementId}
                  onBlockClick={onBlockClick}
                  onGroupClick={onGroupClick}
                  onBlockCreate={onBlockCreate}
                  onGroupCreate={onGroupCreate}
                />
              ),
            })
          )}
          isDraggable={isDraggable}
          selectedElementId={selectedElementId}
          onTabClick={onSectionClick}
          onTabCreate={onSectionCreate}
        />
      </NmpCol>
    </NmpRow>
  );

  if (isDraggable) {
    return <DragDropContext onDragEnd={onDragEnd} children={node} />;
  }

  return node;
};
