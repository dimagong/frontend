import React from "react";

import { EDIT_OPTIONS } from "features/applications/constants";

import FieldStyles from "./Components/FieldStyles";
import FieldProperties from "./Components/FieldProperties";
import FieldDynamicRendering from "./Components/FieldDynamicRendering";

const FieldEdit = ({
  data,
  element,
  editProperty,
  organization,
  editOptions,
  onElementChange,
  onDeleteButtonClick,
  onElementChangesSave,
  onElementChangesCancel,
  onFieldSubmit,
}) => {
  const commonProps = {
    element,
    onElementChange,
    onDeleteButtonClick,
    onElementChangesSave,
    onElementChangesCancel,
    onFieldSubmit,
  };

  return {
    [editOptions.properties]: <FieldProperties {...commonProps} data={data} organization={organization} />,
    [editOptions.styling]: <FieldStyles {...commonProps} />,
    [editOptions.dynamicRendering]: <FieldDynamicRendering data={data} {...commonProps} />,
  }[editProperty];
};

export default FieldEdit;
