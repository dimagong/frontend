import React from "react";

import GroupStyles from "./Components/GroupStyles";
import GroupProperties from "./Components/GroupProperties";
import GroupDynamicRendering from "./Components/GroupDynamicRendering";

const GroupEdit = ({
  element,
  onElementChange,
  editProperty,
  onGroupSectionChange,
  data,
  editOptions,
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
    [editOptions.properties]: (
      <GroupProperties {...commonProps} onGroupSectionChange={onGroupSectionChange} data={data} />
    ),
    [editOptions.styling]: <GroupStyles {...commonProps} />,
    [editOptions.dynamicRendering]: <GroupDynamicRendering data={data} {...commonProps} />,
  }[editProperty];
};

export default GroupEdit;
