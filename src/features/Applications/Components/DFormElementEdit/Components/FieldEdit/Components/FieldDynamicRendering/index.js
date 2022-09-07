import React from "react";

import { ElementTypes } from "components/DForm/constants";

import ConditionalElementRender from "../../../ConditionalElementRender";
import { DCRSupportedFieldTypes } from "../../../ConditionalElementRender/constants";

const FieldDynamicRendering = ({ data, element, onElementChange }) => {
  // When a field's condition effects on itself, it might lead to recursion.
  // So, to prevent condition creation on itself, in case when element type is
  // field filter the element from fields. Also filter only supported DCR fields.
  const fields =
    element.elementType === ElementTypes.Field
      ? Object.values(data.fields)
          .filter((field) => field.id !== element.id)
          .filter((field) => DCRSupportedFieldTypes[field.type] !== undefined)
      : Object.values(data.fields);

  return (
    <ConditionalElementRender
      fields={fields}
      element={element}
      conditions={element.conditions}
      onElementChange={onElementChange}
    />
  );
};

export default FieldDynamicRendering;
