import React from "react";

import SectionStyles from "./Components/SectionStyles";
import SectionProperties from "./Components/SectionProperties";
import SectionDynamicRendering from "./Components/SectionDynamicRendering";

const SectionEdit = ({
  editProperty,
  element,
  onElementChange,
  data,
  onFieldSubmit,
  editOptions,
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
    [editOptions.properties]: <SectionProperties {...commonProps} />,
    [editOptions.styling]: <SectionStyles {...commonProps} />,
    [editOptions.dynamicRendering]: <SectionDynamicRendering data={data} {...commonProps} />,
  }[editProperty];
};

export default SectionEdit;
