import React from "react";

import ConditionalElementRender from "../../../ConditionalElementRender";

const SectionDynamicRendering = ({ onElementChange, data, element }) => {
  return (
    <ConditionalElementRender
      fields={Object.values(data.fields)}
      element={element}
      conditions={element.conditions}
      onElementChange={onElementChange}
    />
  );
};

export default SectionDynamicRendering;
