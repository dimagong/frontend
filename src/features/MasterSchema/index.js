import React from "react";
import { useSelector } from "react-redux";

import { selectSelectedMasterSchemaId } from "app/selectors/masterSchemaSelectors";

import { useMasterSchemaSelectable } from "./hooks/useMasterSchemaSelectable";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const MasterSchema = () => {
  const masterSchemaId = useSelector(selectSelectedMasterSchemaId);
  const [selectedNodes, { toggle: selectNode }] = useMasterSchemaSelectable();

  return (
    <div className="d-flex" key={masterSchemaId}>
      <MasterSchemaContext
        masterSchemaId={masterSchemaId}
        selectedNodes={selectedNodes}
        onSelect={selectNode}
      />
      <MasterSchemaContextFeature masterSchemaId={masterSchemaId} selectedNodes={selectedNodes} />
    </div>
  );
};

export default MasterSchema;
