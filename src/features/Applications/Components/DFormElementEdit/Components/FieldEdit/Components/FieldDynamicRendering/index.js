import React from "react";
import ConditionalElementRender from "../../../ConditionalElementRender";
import { EFFECTS } from "../../../ConditionalElementRender/constants";
import _ from "lodash";

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

  // TODO Handle only one condition for one effect
  const handleConditionAdd = () => {
    if (element.conditions && element.conditions.length) {
      const usedEffects = element.conditions.map((condition) => condition.effect);

      const effectToUse = _.xor(
        usedEffects,
        EFFECTS.map((f) => f.value)
      );

      if (!effectToUse[0]) {
        console.error("There are no more effects ot use");
      } else {
        onElementChange({
          ...element,
          conditions: [...element.conditions, { effect: effectToUse }],
        });
      }
    } else {
      onElementChange({
        ...element,
        conditions: [{ effect: EFFECTS[0].value }],
      });
    }
  };

  return (
    <div>
      <ConditionalElementRender
        onConditionAdd={handleConditionAdd}
        fieldSectionFields={getFieldSectionFields(element)}
        conditions={element.conditions}
      />
    </div>
  );
};

export default FieldDynamicRendering;
