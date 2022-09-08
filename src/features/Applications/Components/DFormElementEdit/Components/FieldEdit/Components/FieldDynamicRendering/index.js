import React from "react";

import ConditionalElementRender from "../../../ConditionalElementRender";

const FieldDynamicRendering = ({ data, element, onElementChange }) => {
  return (
    <ConditionalElementRender
      fields={Object.values(data.fields)}
      element={element}
      conditions={element.conditions}
      onElementChange={onElementChange}
    />
  );
};

export default FieldDynamicRendering;
