import React from "react";
import ConditionalElementRender from "../../../ConditionalElementRender";
import { EFFECTS } from "../../../ConditionalElementRender/constants";
import { v4 } from "uuid";

const FieldDynamicRendering = ({ data, element, onElementChange }) => {
  const getFieldSectionFields = (field) => {
    const fieldSection = Object.values(data.sections).filter((section) =>
      section.relatedGroups.includes(field.groupId)
    )[0];

    return fieldSection.relatedGroups.reduce((fieldSectionFields, groupId) => {
      data.groups[groupId].relatedFields.map((fieldId) => fieldSectionFields.push(data.fields[fieldId]));

      return fieldSectionFields;
    }, []);
  };

  const handleConditionAdd = () => {
    onElementChange({
      ...element,
      conditions: [...(element.conditions || []), { tempId: v4(), effect: EFFECTS[0] }],
    });
  };

  const handleConditionDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this condition?")) {
      onElementChange({
        ...element,
        conditions: element.conditions.filter((condition) => condition.tempId !== id),
      });
    }
  };

  const handleConditionChange = (conditionData) => {
    //TODO hanlde more conditions, temprorary only one can exist for each element
    onElementChange({ ...element, conditions: [conditionData] });
  };

  return (
    <div>
      <ConditionalElementRender
        onConditionChange={handleConditionChange}
        onConditionAdd={handleConditionAdd}
        fieldSectionFields={getFieldSectionFields(element)}
        conditions={element.conditions}
        onConditionDelete={handleConditionDelete}
      />
    </div>
  );
};

export default FieldDynamicRendering;
