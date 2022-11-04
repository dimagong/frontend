import React from "react";

import { EDIT_OPTIONS } from "../../../../constants";

import GroupDynamicRendering from "./Components/GroupDynamicRendering";
import GroupStyles from "./Components/GroupStyles";
import GroupProperties from "./Components/GroupProperties";

const GroupEdit = ({
  element,
  onElementChange,
  editProperty,
  onGroupSectionChange,
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
    [EDIT_OPTIONS.properties]: (
      <GroupProperties {...commonProps} onGroupSectionChange={onGroupSectionChange} data={data} />
    ),
    [EDIT_OPTIONS.styling]: <GroupStyles {...commonProps} />,
    [EDIT_OPTIONS.dynamicRendering]: <GroupDynamicRendering data={data} {...commonProps} />,
  }[editProperty];
};

export default GroupEdit;
