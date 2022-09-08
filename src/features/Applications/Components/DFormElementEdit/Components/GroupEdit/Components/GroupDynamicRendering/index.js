import React from "react";

import ConditionalElementRender from "../../../ConditionalElementRender";

const GroupDynamicRendering = ({ onElementChange, data, element }) => {
  return (
    <div>
      <ConditionalElementRender
        fields={Object.values(data.fields)}
        element={element}
        conditions={element.conditions}
        onElementChange={onElementChange}
      />
    </div>
  );
};

export default GroupDynamicRendering;
