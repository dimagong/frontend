import React from "react";

import { EDIT_OPTIONS } from "../../../../constants";

import SectionProperties from "./Components/SectionProperties";
import SectionStyles from "./Components/SectionStyles";
import SectionDynamicRendering from "./Components/SectionDynamicRendering";

const SectionEdit = ({
  editProperty,
  element,
  onElementChange,
  data,
  onFieldSubmit,
  onDeleteButtonClick,
  onElementChangesCancel,
}) => {
  const commonProps = {
    element,
    onElementChange,
    onFieldSubmit,
    onDeleteButtonClick,
    onElementChangesCancel,
  };

  return {
    [EDIT_OPTIONS.properties]: <SectionProperties {...commonProps} />,
    [EDIT_OPTIONS.styling]: <SectionStyles {...commonProps} />,
    [EDIT_OPTIONS.dynamicRendering]: <SectionDynamicRendering data={data} {...commonProps} />,
  }[editProperty];
};

export default SectionEdit;
