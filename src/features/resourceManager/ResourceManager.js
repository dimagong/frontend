import _ from "lodash/fp";
import { Row } from "reactstrap";
import { useSelector } from "react-redux";
import React, { useEffect, useMemo } from "react";

import { selectSelectedResourceManager } from "app/selectors/resourceManagerSelector";

import RMContext from "./components/RMContext";
import RMContextFeature from "./components/RMContextFeature";

import { useMasterSchemaSelectable } from "../masterSchema/hooks/useMasterSchemaSelectable";
import { useMasterSchemaSelected } from "../masterSchema/hooks/useMasterSchemaSelected";

const ResourceManager = () => {
  const resourceManager = useSelector(selectSelectedResourceManager);

  const [selectedNodes, selectable] = useMasterSchemaSelectable(useMasterSchemaSelectable.Stratagy.OnlySingleField);
  const selected = useMasterSchemaSelected(selectedNodes);
  const selectedIds = useMemo(() => selectedNodes.map(_.get("nodeId")), [selectedNodes]);

  // Unselect for different resource manager
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => selectable.clear(), [resourceManager.id]);

  return (
    <Row>
      <RMContext selectedIds={selectedIds} onSelect={selectable.select} resourceManagerId={resourceManager.id} />
      {selected.field ? (
        <RMContextFeature
          field={selected.field}
          key={selected.field.id}
          organizationId={resourceManager.organization_id}
          organizationType={resourceManager.organization_type}
        />
      ) : null}
    </Row>
  );
};

export default ResourceManager;
