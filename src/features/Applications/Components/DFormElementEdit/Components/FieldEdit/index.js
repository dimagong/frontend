import React from "react";

import FieldProperties from "./Components/FieldProperties";
import FieldDynamicRendering from "./Components/FieldDynamicRendering";
import FieldStyles from "./Components/FieldStyles";

import { EDIT_OPTIONS } from "../../../../constants";

const FieldEdit = ({ element, onElementChange, editProperty, organization, data, onFieldGroupChange }) => {
  const commonProps = {
    element,
    onElementChange,
  };

  return {
    [EDIT_OPTIONS.properties]: (
      <FieldProperties
        {...commonProps}
        organization={organization}
        data={data}
        onFieldGroupChange={onFieldGroupChange}
      />
    ),
    [EDIT_OPTIONS.styling]: <FieldStyles {...commonProps} />,
    [EDIT_OPTIONS.dynamicRendering]: <FieldDynamicRendering {...commonProps} />,
  }[editProperty];
};

export default FieldEdit;
