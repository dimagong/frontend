import React from "react";
import NestedOrderComponent from "./NestedOrderComponent";
import { ELEMENT_TYPES } from "../../constants";

const ElementsReorderComponent = ({ applicationData, onReorder }) => {
  const handleDragEnd = (result) => {
    if (result.destination === null || result.destination.index === result.source.index) return;

    onReorder(result);
  };

  const sections = applicationData.sectionsOrder.map((sectionId) => applicationData.sections[sectionId]);
  const selectSectionGroups = (section) => {
    return section.relatedGroups.map((relatedGroupId) => applicationData.groups[relatedGroupId]);
  };

  const selectGroupFields = (group) => {
    return group.relatedFields.map((relatedFieldId) => applicationData.fields[relatedFieldId]);
  };

  const fieldNameSelector = (field) => field.title;

  return (
    <div style={{ paddingLeft: "35px", paddingRight: "35px" }}>
      <NestedOrderComponent onDragEnd={handleDragEnd} type={ELEMENT_TYPES.section} items={sections}>
        <NestedOrderComponent
          onDragEnd={handleDragEnd}
          type={ELEMENT_TYPES.group}
          isNested
          childItemsSelector={selectSectionGroups}
        >
          <NestedOrderComponent
            onDragEnd={handleDragEnd}
            type={ELEMENT_TYPES.field}
            isNested
            childItemsSelector={selectGroupFields}
            elementNameSelector={fieldNameSelector}
          />
        </NestedOrderComponent>
      </NestedOrderComponent>
    </div>
  );
};

export default ElementsReorderComponent;
