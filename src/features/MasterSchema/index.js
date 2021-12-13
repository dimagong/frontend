import { useSelector } from "react-redux";
import { get, pipe, isEqual, includes } from "lodash/fp";
import React, { useCallback, useMemo } from "react";

import { useDidUpdate } from "hooks/use-did-update";
import { useToggleable } from "hooks/use-toggleable";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const getNodeIdPredicate = (nodeId) => pipe(get("nodeId"), isEqual(nodeId));

export const useExpandable = (keys, initialKeys) => {
  const toggleable = useToggleable(initialKeys);

  const reset = useCallback(() => toggleable.setKeys(initialKeys), [initialKeys, toggleable]);

  const expand = useCallback(
    (key) => toggleable.setKeys((prev) => (prev.includes(key) ? prev : [...prev, key])),
    [toggleable]
  );

  const collapse = useCallback(
    (key) => toggleable.setKeys((prev) => prev.filter(pipe(isEqual(key), (v) => !v))),
    [toggleable]
  );
  const expandAll = useCallback(() => toggleable.setKeys(keys), [keys, toggleable]);
  const isInitial = useMemo(() => isEqual(initialKeys, toggleable.keys), [initialKeys, toggleable.keys]);

  return {
    ...toggleable,
    isInitial,
    reset,
    expand,
    collapse,
    expandAll,
  };
};

const MasterSchema = () => {
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const nodes = useMemo(() => [hierarchy, ...hierarchy.children], [hierarchy]);

  const selectable = useToggleable([]);
  const expandable = useExpandable(nodes.map(get("nodeId")), [hierarchy.nodeId]);
  const collapseWhole = useCallback(
    (nodeId) => {
      debugger;
      const node = nodes.find(pipe(get("nodeId"), isEqual(nodeId)));
      const keysToCollapse = [nodeId, ...nodes.filter(({ key }) => node.groups.includes(key)).map(get("nodeId"))];

      keysToCollapse.forEach(key => expandable.collapse(key));
    },
    [expandable, nodes]
  );

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
    return { selectable, expandable, collapseWhole, nodes, onNodeSelect, selected, hierarchy, unapproved };
  }, [selectable, expandable, collapseWhole, nodes, onNodeSelect, selected, hierarchy, unapproved]);

  // clear selectable on selected master schema change
  useDidUpdate(() => selectable.clear(), [selectedId]);

  // set expanded first brand element
  useDidUpdate(() => expandable.reset(), [selectedId]);

  return (
    <div className="d-flex">
      <MasterSchemaContext state={state} />
      <MasterSchemaContextFeature state={state} />
    </div>
  );
};

export default MasterSchema;
