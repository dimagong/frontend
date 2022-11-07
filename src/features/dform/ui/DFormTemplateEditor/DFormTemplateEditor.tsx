import type { FC } from "react";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { DragDropContext } from "react-beautiful-dnd";

import { NmpButton, NmpCol, NmpRow } from "features/nmp-ui";

import { DFormSectionElement } from "../../types";
import { DFormTemplateSectionEditor } from "./DFormTemplateSectionEditor";
import { DFormSectionTabs, DFormSectionTabsProps } from "../DFormSectionTabs";

type Item = Unpack<DFormSectionTabsProps["items"]>;

export type DFormTemplateEditorProps = {
  sections: DFormSectionElement[];
  isDraggable?: boolean;
  onSectionCreate?: () => void;
};

export const DFormTemplateEditor: FC<DFormTemplateEditorProps> = (props) => {
  const { sections, isDraggable = false, onSectionCreate } = props;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <NmpRow>
        <NmpCol span="24">
          <DFormSectionTabs
            items={sections.map(
              (section: DFormSectionElement): Item => ({
                key: section.id,
                label: section.name,
                children: (
                  <DFormTemplateSectionEditor
                    sectionId={section.id}
                    sectionName={section.name}
                    isDraggable={isDraggable}
                  />
                ),
              })
            )}
            isDraggable={isDraggable}
            onCreate={onSectionCreate}
          />
        </NmpCol>
      </NmpRow>
    </DragDropContext>
  );
};
