import React from "react";

import { ELEMENT_TYPES } from "components/DForm/constants";

import ConditionalElementRender from "../../../ConditionalElementRender";

const FieldDynamicRendering = ({ data, element, onElementChange }) => {
  // When a field's condition effects on itself, it might lead to recursion.
  // So, to prevent condition creation on itself, in case when element type is
  // field filter the element from fields.
  const fields =
    element.elementType === ELEMENT_TYPES.field
      ? Object.values(data.fields).filter((field) => field.id !== element.id)
      : Object.values(data.fields);

  return (
    <div>
      <ConditionalElementRender
        fields={fields}
        element={element}
        conditions={element.conditions}
        onElementChange={onElementChange}
      />
    </div>
  );
};

export default FieldDynamicRendering;
