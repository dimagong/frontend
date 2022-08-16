import React from "react";
import ConditionalElementRender from "../../../ConditionalElementRender";
import { EFFECTS } from "../../../ConditionalElementRender/constants";
import { ELEMENT_TYPES } from "../../../../../../constants";
import { v4 } from "uuid";

const FieldDynamicRendering = ({ data, element, onElementChange }) => {
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

  const fields =
    element.elementType !== ELEMENT_TYPES.field
      ? Object.values(data.fields)
      : Object.values(data.fields).filter((field) => field.id !== element.id);

  return (
    <div>
      <ConditionalElementRender
        onConditionChange={handleConditionChange}
        onConditionAdd={handleConditionAdd}
        fields={fields}
        conditions={element.conditions}
        onConditionDelete={handleConditionDelete}
      />
    </div>
  );
};

export default FieldDynamicRendering;
