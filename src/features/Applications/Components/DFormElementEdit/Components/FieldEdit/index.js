import React from "react";

import { EDIT_OPTIONS } from "features/Applications/constants";

import FieldStyles from "./Components/FieldStyles";
import FieldProperties from "./Components/FieldProperties";
import FieldDynamicRendering from "./Components/FieldDynamicRendering";

const FieldEdit = ({
  data,
  element,
  editProperty,
  organization,
  onElementChange,
  onFieldGroupChange,
  onDeleteButtonClick,
  onElementChangesSave,
  onElementChangesCancel,
}) => {
  const commonProps = { element, onElementChange, onDeleteButtonClick, onElementChangesSave, onElementChangesCancel };

  return {
    [EDIT_OPTIONS.properties]: (
      <FieldProperties
        {...commonProps}
        data={data}
        organization={organization}
        onFieldGroupChange={onFieldGroupChange}
      />
    ),
    [EDIT_OPTIONS.styling]: <FieldStyles {...commonProps} />,
    [EDIT_OPTIONS.dynamicRendering]: <FieldDynamicRendering data={data} {...commonProps} />,
  }[editProperty];
};

export default FieldEdit;
