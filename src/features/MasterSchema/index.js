import { useSelector } from "react-redux";
import { get, pipe, isEqual } from "lodash/fp";
import React, { useCallback, useMemo } from "react";

import { useDidUpdate } from "hooks/use-did-update";
import { useToggleable } from "hooks/use-toggleable";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const getNodeIdPredicate = (nodeId) => pipe(get("nodeId"), isEqual(nodeId));

const MasterSchema = () => {
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const selectable = useToggleable([]);
  const expandable = useToggleable([hierarchy.nodeId]);

  const nodes = useMemo(() => [hierarchy, ...hierarchy.children], [hierarchy]);

  const selected = useMemo(() => {
    const selectedNodes = selectable.keys.map((nodeId) => nodes.find(getNodeIdPredicate(nodeId))).filter(Boolean);
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
  }, [nodes, selectable.keys]);

  const onNodeSelect = useCallback(
    (nodeId) => {
      const toSelectNode = nodes.find(getNodeIdPredicate(nodeId));
      const thereIsSelectedFields = selected.fields.length > 0;
      const thereIsSelectedGroups = selected.groups.length > 0;

      if (toSelectNode.isContainable && thereIsSelectedGroups && !selected.groups.includes(toSelectNode)) {
        selectable.clear();
      }

      if (toSelectNode.isContainable && thereIsSelectedFields) {
        selectable.clear();
      }

      if (!toSelectNode.isContainable && thereIsSelectedGroups) {
        selectable.clear();
      }

      selectable.select(nodeId);
    },
    [nodes, selectable, selected]
  );

  const state = useMemo(() => {
    return { selectable, expandable, nodes, onNodeSelect, selected, hierarchy, unapproved };
  }, [hierarchy, nodes, onNodeSelect, selectable, expandable, selected, unapproved]);

  // clear selectable on selected master schema change
  useDidUpdate(() => selectable.clear(), [selectedId]);

  // set expanded first brand element
  useDidUpdate(() => expandable.setKeys([hierarchy.nodeId]), [selectedId]);

  return (
    <div className="d-flex" key={hierarchy.name}>
      <MasterSchemaContext state={state} />
      <MasterSchemaContextFeature state={state} />
    </div>
  );
};

export default MasterSchema;
