import React from "react";

import { ElementTypes } from "components/DForm";

import NestedOrderComponent from "./NestedOrderComponent";

const ElementsReorderComponent = ({ applicationData, onReorder }) => {
  const handleDragEnd = (result) => {
    if (result.destination === null || result.destination.index === result.source.index) return;

    onReorder(result);
  };

  if (!applicationData.sectionsOrder || applicationData.sectionsOrder.length === 0) {
    return <div>There are no elements</div>;
  }

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
      <NestedOrderComponent onDragEnd={handleDragEnd} type={ElementTypes.Section} items={sections}>
        <NestedOrderComponent
          onDragEnd={handleDragEnd}
          type={ElementTypes.Group}
          isNested
          childItemsSelector={selectSectionGroups}
        >
          <NestedOrderComponent
            onDragEnd={handleDragEnd}
            type={ElementTypes.Field}
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
