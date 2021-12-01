import { useSelector } from "react-redux";
import { get, pipe, isEqual } from "lodash/fp";
import React, { useEffect, useMemo } from "react";

import { useToggleable } from "hooks/use-toggleable";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const MasterSchema = () => {
  const selectable = useToggleable([]);

  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const selected = useMemo(() => {
    const nodes = [hierarchy, ...hierarchy.children];
    const selectedNodes = selectable.keys.map((nodeId) => nodes.find(pipe(get("nodeId"), isEqual(nodeId))));
    const selectedFields = selectedNodes.filter(pipe(get("isContainable"), (v) => !v));
    const selectedGroups = selectedNodes.filter(get("isContainable"));

    return {
      nodes: selectedNodes,
      fields: selectedFields,
      groups: selectedGroups,
      node: selectedNodes[0],
      field: selectedFields[0],
      group: selectedGroups[0],
    };
  }, [hierarchy, selectable]);

  const state = useMemo(
    () => ({ selectable, selected, hierarchy, unapproved }),
    [hierarchy, selectable, selected, unapproved]
  );

  // clear selectable on selected master schema change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void selectable.clear(), [selectedId]);

  return (
    <div className="d-flex">
      <MasterSchemaContext state={state} />
      <MasterSchemaContextFeature state={state} />
    </div>
  );
};

export default MasterSchema;
