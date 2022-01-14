import React from "react";
import { useSelector } from "react-redux";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

import { useMasterSchemaSelectable } from "./hooks/useMasterSchemaSelectable";

const MasterSchema = () => {
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const selectable = useMasterSchemaSelectable(hierarchy);

  const onSelect = (node) => selectable.toggle(node.nodeId);

  return (
    <div className="d-flex master-schema-container">
      <MasterSchemaContext
        hierarchy={hierarchy}
        unapproved={unapproved}
        selectedIds={selectable.keys}
        onSelect={onSelect}
      />
      <MasterSchemaContextFeature selectable={selectable} />
    </div>
  );
};

export default MasterSchema;
