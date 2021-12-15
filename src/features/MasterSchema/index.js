import { useSelector } from "react-redux";
import { get, pipe, isEqual } from "lodash/fp";
import React, { useCallback, useMemo } from "react";

import { useDidUpdate } from "hooks/use-did-update";
import { useToggleable } from "hooks/use-toggleable";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

import { MasterSchemaContext as MasterSchemaReactContext } from "./master-schema-context";

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

  const collapseAll = useCallback(() => toggleable.clear(), [toggleable]);

  return {
    reset,
    expand,
    collapse,
    expandAll,
    collapseAll,
    ...toggleable,
  };
};

export const useMasterSchemaExpandable = (nodes, hierarchy) => {
  const expandable = useExpandable(nodes.map(get("nodeId")), [hierarchy.nodeId]);

  const collapseWhole = useCallback(
    (nodeId) => {
      const node = nodes.find(pipe(get("nodeId"), isEqual(nodeId)));
      const keysToCollapse = [nodeId, ...nodes.filter(({ key }) => node.groups.includes(key)).map(get("nodeId"))];

      keysToCollapse.forEach((key) => expandable.collapse(key));
    },
    [expandable, nodes]
  );

  const toggle = (nodeId) => {
    expandable.includes(nodeId) ? collapseWhole(nodeId) : expandable.expand(nodeId);
  };

  const isCollapsable = useMemo(
    () => expandable.keys.length > 1 /* && expandable.includes(hierarchy.nodeId)*/,
    [expandable.keys.length]
  );

  return {
    isCollapsable,
    ...expandable,
    toggle,
  };
};

const getNodeIdPredicate = (nodeId) => pipe(get("nodeId"), isEqual(nodeId));

export const useMasterSchemaSelectable = (nodes) => {
  const selectable = useToggleable([]);

  const selected = useMemo(() => {
    const selectedNodes = selectable.keys.map((nodeId) => nodes.find(getNodeIdPredicate(nodeId))).filter(Boolean);
    const selectedFields = selectedNodes.filter(pipe(get("isContainable"), (v) => !v));
    const selectedGroups = selectedNodes.filter(get("isContainable"));
    const thereIsSelectedSystemNode = selectedNodes.some(get("isSystem"));

    const memberFirmsGroups = nodes.filter(get("isMemberFirmGroup"));
    const selectedFieldsFromMemberFirm = selectedFields.filter(({ key }) => {
      return memberFirmsGroups.some((group) => group.fields.includes(key));
    });
    const areSelectedFieldsContainCommonAndMemberFirmFields =
      selectedFields.length > selectedFieldsFromMemberFirm.length && selectedFieldsFromMemberFirm.length > 0;

    return {
      nodes: selectedNodes,
      fields: selectedFields,
      groups: selectedGroups,
      node: selectedNodes[0],
      field: selectedFields[0],
      group: selectedGroups[0],
      thereIsSelectedSystemNode,
      areSelectedFieldsContainCommonAndMemberFirmFields,
    };
  }, [nodes, selectable.keys]);

  const toggle = useCallback(
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

      selectable.toggle(nodeId);
    },
    [nodes, selectable, selected]
  );

  return {
    selected,
    ...selectable,
    toggle,
  };
};

const MasterSchema = () => {
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const nodes = useMemo(() => [hierarchy, ...hierarchy.children], [hierarchy]);

  const selectable = useMasterSchemaSelectable(nodes);
  const expandable = useMasterSchemaExpandable(nodes, hierarchy);

  const context = useMemo(() => {
    return {
      selectable,
      expandable,
      nodes,
      hierarchy,
      unapproved,
    };
  }, [selectable, expandable, nodes, hierarchy, unapproved]);

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

  useDidUpdate(() => {
    selectable.clear();
    expandable.reset();
  }, [selectedId]);

  return (
    <div className="d-flex master-schema-container">
      <MasterSchemaReactContext.Provider value={context}>
        <MasterSchemaContext state={state}/>
        <MasterSchemaContextFeature state={state} />
      </MasterSchemaReactContext.Provider>
    </div>
  );
};

export default MasterSchema;
