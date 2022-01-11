import React from "react";
import { useSelector } from "react-redux";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import { useTreeHierarchySelectable } from "components/TreeHierarchy";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const MasterSchema = () => {
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const selectable = useTreeHierarchySelectable(hierarchy);

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
