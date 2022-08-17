import React from "react";
import ConditionalElementRender from "../../../ConditionalElementRender";
import { EFFECTS } from "../../../ConditionalElementRender/constants";
import { ELEMENT_TYPES } from "../../../../../../constants";
import { v4 } from "uuid";

const FieldDynamicRendering = ({ data, element, onElementChange }) => {
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

export default FieldDynamicRendering;
