import React from "react";
import type { FC } from "react";
import { DragDropContext, DragDropContextProps } from "react-beautiful-dnd";

import { NmpCol, NmpRow } from "features/nmp-ui";

import {
  DformBlockId,
  DformBlockModel,
  DformElementId,
  DformGroupId,
  DformGroupModel,
  DformSectionId,
  DformSectionModel,
} from "../../data/models";

import { DformSchemaContext } from "../DformSchemaContext";
import { DFormEditableSectionTabs } from "./DFormEditableSectionTabs";
import { DFormTemplateSectionEditor } from "./DFormTemplateSectionEditor";

export type DFormTemplateEditorProps = {
  blocks: DformBlockModel[];
  groups: DformGroupModel[];
  sections: DformSectionModel[];
  isDraggable?: boolean;
  selectedElementId?: DformElementId;
  relatedSectionsIds: DformSectionId[];
  onDragEnd?: DragDropContextProps["onDragEnd"];
  onBlockClick?: (blockId: DformBlockId) => void;
  onGroupClick?: (groupId: DformGroupId) => void;
  onBlockCreate?: (groupId: DformGroupId, blockId?: DformBlockId) => void;
  onGroupCreate?: (sectionId: DformSectionId) => void;
  onSectionClick?: (sectionId: DformSectionId) => void;
  onSectionCreate?: () => void;
};

export const DFormTemplateEditor: FC<DFormTemplateEditorProps> = (props) => {
  const {
    blocks,
    groups,
    sections,
    isDraggable,
    selectedElementId,
    relatedSectionsIds,
    onDragEnd = () => {},
    onBlockClick,
    onGroupClick,
    onBlockCreate,
    onGroupCreate,
    onSectionClick,
    onSectionCreate,
  } = props;

  const node = (
    <DformSchemaContext.Provider
      blocks={blocks}
      groups={groups}
      sections={sections}
      relatedSectionsIds={relatedSectionsIds}
    >
      <NmpRow>
        <NmpCol span="24">
          <DFormEditableSectionTabs
            isDraggable={isDraggable}
            selectedElementId={selectedElementId}
            relatedSectionsIds={relatedSectionsIds}
            onSectionClick={onSectionClick}
            onSectionCreate={onSectionCreate}
          >
            {(sectionId) => (
              <DFormTemplateSectionEditor
                sectionId={sectionId}
                isDraggable={isDraggable}
                selectedElementId={selectedElementId}
                onBlockClick={onBlockClick}
                onGroupClick={onGroupClick}
                onBlockCreate={onBlockCreate}
                onGroupCreate={onGroupCreate}
              />
            )}
          </DFormEditableSectionTabs>
        </NmpCol>
      </NmpRow>
    </DformSchemaContext.Provider>
  );

  if (isDraggable) {
    return <DragDropContext onDragEnd={onDragEnd} children={node} />;
  }

  return node;
};
