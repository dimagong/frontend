import _ from "lodash/fp";
import React, { useMemo } from "react";

import { useDidUpdate } from "hooks/use-did-update";
import { useToggleable } from "hooks/use-toggleable";

export const useTreeHierarchySelectable = (hierarchy, strategyId = useTreeHierarchySelectable.defaultStrategy) => {
  const toggleable = useToggleable([]);

  const nodes = hierarchy?.nodes || {};
  const masterSchemaId = hierarchy?.masterSchemaId;

  const isSomeNodeSystem = (nodes) => nodes.some(_.get("isSystem"));

  const getGroups = (nodes) => nodes.filter(_.get("isContainable"));

  const getFields = (nodes) => nodes.filter(_.negate(_.get("isContainable")));

  const getMemberFirmGroups = (nodes) => _.filter(_.get("isMemberFirmGroup"), nodes);

  const getSelectedNodes = (selectedIds, nodes) => selectedIds.map((nodeId) => nodes[nodeId]).filter(Boolean);

  const getSelectedFieldsInMemberFirms = (selectedNodes, memberFirmGroups) => {
    return selectedNodes.filter(({ nodeId }) => {
      return memberFirmGroups.some((group) => group.fields.includes(nodeId));
    });
  };

  const areCommonAndMemberFirmFieldsSelected = (selectedNodes, memberFirmGroups) => {
    const selectedFieldsFromMemberFirm = getSelectedFieldsInMemberFirms(selectedNodes, memberFirmGroups);
    return selectedNodes.length > selectedFieldsFromMemberFirm.length && selectedFieldsFromMemberFirm.length > 0;
  };

  const selectedNodes = useMemo(() => getSelectedNodes(toggleable.keys, nodes), [nodes, toggleable.keys]);
  const selectedFields = useMemo(() => getFields(selectedNodes), [selectedNodes]);
  const selectedGroups = useMemo(() => getGroups(selectedNodes), [selectedNodes]);
  const thereIsSelectedSystemNode = useMemo(() => isSomeNodeSystem(selectedNodes), [selectedNodes]);
  const memberFirmGroups = useMemo(() => getMemberFirmGroups(nodes), [nodes]);
  const areSelectedFieldsContainCommonAndMemberFirmFields = useMemo(
    () => areCommonAndMemberFirmFieldsSelected(selectedNodes, memberFirmGroups),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [memberFirmGroups, selectedNodes]
  );

  const selected = useMemo(
    () => ({
      nodes: selectedNodes,
      fields: selectedFields,
      groups: selectedGroups,
      node: selectedNodes[0],
      field: selectedFields[0],
      group: selectedGroups[0],
      thereIsSelectedSystemNode,
      areSelectedFieldsContainCommonAndMemberFirmFields,
    }),
    [
      selectedNodes,
      selectedFields,
      selectedGroups,
      thereIsSelectedSystemNode,
      areSelectedFieldsContainCommonAndMemberFirmFields,
    ]
  );

  const strategies = {
    [useTreeHierarchySelectable.STRATEGY.OnlyField]: React.useCallback(
      (nodeId) => {
        const toSelectNode = nodes[nodeId];

        // Unable to select field simultaneously with groups
        if (!toSelectNode.isContainable) {
          return toggleable.toggle([nodeId, ...selected.fields.map(_.get("nodeId"))]);
        }
      },
      [nodes, selected.fields, toggleable]
    ),

    [useTreeHierarchySelectable.STRATEGY.MultipleFieldsAndSingleGroup]: React.useCallback(
      (nodeId) => {
        const toSelectNode = nodes[nodeId];

        // Unable to select field simultaneously with groups
        if (!toSelectNode.isContainable) {
          return toggleable.toggle([nodeId, ...selected.groups.map(_.get("nodeId"))]);
        }

        // Unable to select group simultaneously with groups and fields
        if (toSelectNode.isContainable) {
          return toggleable.toggle([
            nodeId,
            ...selected.groups.map(_.get("nodeId")),
            ...selected.fields.map(_.get("nodeId")),
          ]);
        }
      },
      [nodes, selected.fields, selected.groups, toggleable]
    ),
  };

  const toggle = strategies[strategyId];

  useDidUpdate(() => toggleable.clear(), [masterSchemaId]);

  return {
    selected,
    toggle,
    keys: toggleable.keys,
    clear: toggleable.clear,
    getGroups,
  };
};

useTreeHierarchySelectable.STRATEGY = {
  OnlyField: Symbol("Select only single field."),
  MultipleFieldsAndSingleGroup: Symbol("Select multiple fields and single group."),
};

useTreeHierarchySelectable.defaultStrategy = useTreeHierarchySelectable.STRATEGY.MultipleFieldsAndSingleGroup;
