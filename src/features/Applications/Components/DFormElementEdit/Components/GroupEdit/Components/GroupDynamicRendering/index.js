import React from "react";

import { ELEMENT_TYPES } from "components/DForm/constants";

import ConditionalElementRender from "../../../ConditionalElementRender";

const GroupDynamicRendering = ({ onElementChange, data, element }) => {
  const fields =
    element.elementType !== ELEMENT_TYPES.field
      ? Object.values(data.fields)
      : Object.values(data.fields).filter((field) => field.id !== element.id);

  return (
    <div>
      <ConditionalElementRender
        element={element}
        onElementChange={onElementChange}
        fields={fields}
        conditions={element.conditions}
      />
    </div>
  );
};

export default GroupDynamicRendering;
