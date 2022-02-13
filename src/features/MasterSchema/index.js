import React from "react";
import { useSelector } from "react-redux";

import { selectSelectedMasterSchemaId } from "app/selectors/masterSchemaSelectors";

import { useMasterSchemaSelectable } from "./hooks/useMasterSchemaSelectable";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const MasterSchema = () => {
  const masterSchemaId = useSelector(selectSelectedMasterSchemaId);
  const [selectedNodes, { select, clear }] = useMasterSchemaSelectable(
    useMasterSchemaSelectable.Stratagy.SingleGroupAndMultipleFields
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => void clear(), [masterSchemaId]);

  return (
    <div className="d-flex" key={masterSchemaId}>
      <MasterSchemaContext masterSchemaId={masterSchemaId} selectedNodes={selectedNodes} onSelect={select} />
      <MasterSchemaContextFeature masterSchemaId={masterSchemaId} selectedNodes={selectedNodes} />
    </div>
  );
};

export default MasterSchema;
