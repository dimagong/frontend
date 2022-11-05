import type { FC } from "react";
import React, { useMemo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import type { DragDropContextProps, DropResult } from "react-beautiful-dnd";

import { NmpCol, NmpRow } from "features/nmp-ui";

import SectionsSideBar from "./SectionsSideBar";
import { DFormEditableGroup } from "./DFormGroup";
import { DFormEditableBlock } from "./DFormBlock";
import { DFormAddElement } from "./DFormAddElement";
import { DFormEditableSection } from "./DFormSection";
import { DFormSchema, DFormBlockTypes, DFormElementTypes } from "../types";

const recognizeBlockType = (fieldType: string) => {
  switch (fieldType) {
    case "helpText":
      return DFormBlockTypes.HelpText;
    case "resource":
      return DFormBlockTypes.Resource;
    default:
      return DFormBlockTypes.Field;
  }
};

type Props = {
  schema?: DFormSchema;
  selectedElement?: { id: string };
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

  const sections = useMemo(
    () => schema.sectionsOrder.map((sectionId) => schema.sections[sectionId]),
    [schema.sections, schema.sectionsOrder]
  );

  const [selectedSectionId, setSelectedSectionId] = useState(() => schema.sectionsOrder[0]);
  const selectedSection = useMemo(() => schema.sections[selectedSectionId], [schema.sections, selectedSectionId]);

  const onSectionClick = (sectionId: string) => {
    if (onElementClick) {
      onElementClick(schema.sections[sectionId], "section");
    }
    setSelectedSectionId(sectionId);
  };

  const onDragEnd = (result: DropResult) => {
    if (
      result.destination === null ||
      (result.destination!.index === result.source.index &&
        result.source.droppableId === result.destination!.droppableId)
    )
      return;
    // @ts-ignore
    propOnDragEnd(result);
  };

  // const [isCollapsed, setIsCollapsed] = useState(false);

  /*const onIsCollapsedChange = (event) => {
    setIsCollapsed(event.target.checked);
  };*/

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="d-flex">
        {/*<NmpCheckbox id="isCollapsed" onChange={onIsCollapsedChange}>
          <DFormLabel label="Collapse" isSmall />
        </NmpCheckbox>*/}

        <SectionsSideBar
          errors={[]}
          sections={sections}
          completed={undefined}
          isConfigurable
          selectedSection={selectedSectionId}
          sectionsProgress={{}}
          onSectionCreate={onSectionCreate}
          onSectionSelect={onSectionClick}
        />

        <NmpRow>
          <NmpCol span="24">
            {selectedSectionId ? (
              <DFormEditableSection
                sectionId={selectedSectionId}
                sectionName={selectedSection.name}
                isDraggable
                key={selectedSectionId}
              >
                {selectedSection.relatedGroups
                  .map((groupId) => schema.groups[groupId])
                  .map((group, groupIndex) => (
                    <DFormEditableGroup
                      groupId={group.id}
                      groupName={group.name}
                      groupIndex={groupIndex}
                      isSelected={selectedElement?.id === group.id}
                      isDraggable
                      // @ts-ignore
                      onClick={() => onElementClick(group, "group")}
                      key={group.id}
                    >
                      {group.relatedFields
                        .map((fieldId) => schema.fields[fieldId])
                        .map((block, blockIndex) => (
                          <DFormEditableBlock
                            label={block.title}
                            blockId={block.id}
                            blockIndex={blockIndex}
                            format={block.format}
                            uiStyle={block.uiStyle}
                            helpText={block.helpTextValue}
                            blockType={recognizeBlockType(block.type)}
                            fieldType={block.type}
                            blockSize={block.classes}
                            isRequired={block.isRequired}
                            isSelected={selectedElement?.id === block.id}
                            isDraggable
                            isLabelShowing={block.isLabelShowing}
                            // @ts-ignore
                            onClick={() => onElementClick(block, "field")}
                            // @ts-ignore
                            onBlockAdd={() => onFieldCreate(group.id, block.id)}
                            key={block.id}
                          />
                        ))}

                      {group.relatedFields.length === 0 ? (
                        <NmpCol span="24">
                          <DFormAddElement
                            elementType={DFormElementTypes.Block}
                            // @ts-ignore
                            onBlockAdd={() => onFieldCreate(group.id)}
                          />
                        </NmpCol>
                      ) : null}
                    </DFormEditableGroup>
                  ))}

                <DFormAddElement
                  elementType={DFormElementTypes.Group}
                  // @ts-ignore
                  onGroupAdd={() => onGroupCreate(selectedSectionId)}
                />
              </DFormEditableSection>
            ) : null}
          </NmpCol>
        </NmpRow>

        {/*<DroppableDFormSections
            schema={schema}
            selectedElement={selectedElement}
            selectedSectionId={selectedSectionId}
            onGroupCreate={onGroupCreate}
            onFieldCreate={onFieldCreate}
            onElementClick={onElementClick}
            isCollapsed={isCollapsed}
          />*/}
      </div>
    </DragDropContext>
  );
};
