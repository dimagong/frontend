import _ from "lodash/fp";
import { useSelector } from "react-redux";
import React, { useEffect, useMemo } from "react";

import { selectSelectedResourceManager } from "app/selectors/resourceManagerSelector";

import RMContextComponent from "./components/RMContext";
import RMContextFeatureComponent from "./components/RMContextFeature";

import { useMasterSchemaSelectable } from "../MasterSchema/hooks/useMasterSchemaSelectable";
import { useMasterSchemaSelected } from "../MasterSchema/hooks/useMasterSchemaSelected";

const ResourceManager = () => {
  const resourceManager = useSelector(selectSelectedResourceManager);

  const [selectedNodes, selectable] = useMasterSchemaSelectable(useMasterSchemaSelectable.Stratagy.OnlySingleField);
  const selected = useMasterSchemaSelected(selectedNodes);
  const selectedIds = useMemo(() => selectedNodes.map(_.get("nodeId")), [selectedNodes]);

  // Unselect for different resource manager
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => selectable.clear(), [resourceManager.id]);

  return (
    <div className="d-flex">
      <RMContextComponent
        selectedIds={selectedIds}
        onSelect={selectable.select}
        resourceManagerId={resourceManager.id}
      />

      {selected.field ? <RMContextFeatureComponent field={selected.field} /> : null}
    </div>
  );
};

export default ResourceManager;
