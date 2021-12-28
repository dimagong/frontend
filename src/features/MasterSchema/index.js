import { get, negate } from "lodash/fp";
import { useSelector } from "react-redux";
import React, { useCallback, useMemo } from "react";

import { useDidUpdate } from "hooks/use-did-update";
import { useToggleable } from "hooks/use-toggleable";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

import { MasterSchemaContext as MasterSchemaReactContext } from "./master-schema-context";

export const useMasterSchemaSelectable = (nodeMap) => {
  const toggleable = useToggleable([]);

  const isSomeNodeSystem = (nodes) => nodes.some(get("isSystem"));

  const getGroups = (nodes) => nodes.filter(get("isContainable"));

  const getFields = (nodes) => nodes.filter(negate(get("isContainable")));

  const getMemberFirmGroups = (nodeMap) => [...nodeMap.values()].filter(get("isMemberFirmGroup"));

  const getSelectedNodes = (selectedIds, nodeMap) => selectedIds.map((nodeId) => nodeMap.get(nodeId)).filter(Boolean);

  const getSelectedFieldsInMemberFirms = (selectedNodes, memberFirmGroups) => {
    return selectedNodes.filter(({ nodeId }) => {
      return memberFirmGroups.some((group) => group.fields.includes(nodeId));
    });
  };

  const areCommonAndMemberFirmFieldsSelected = (selectedNodes, memberFirmGroups) => {
    const selectedFieldsFromMemberFirm = getSelectedFieldsInMemberFirms(selectedNodes, memberFirmGroups);
    return selectedNodes.length > selectedFieldsFromMemberFirm.length && selectedFieldsFromMemberFirm.length > 0;
  };

  const selectedNodes = useMemo(() => getSelectedNodes(toggleable.keys, nodeMap), [nodeMap, toggleable.keys]);
  const selectedFields = useMemo(() => getFields(selectedNodes), [selectedNodes]);
  const selectedGroups = useMemo(() => getGroups(selectedNodes), [selectedNodes]);
  const thereIsSelectedSystemNode = useMemo(() => isSomeNodeSystem(selectedNodes), [selectedNodes]);
  const memberFirmGroups = useMemo(() => getMemberFirmGroups(nodeMap), [nodeMap]);
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

  const toggle = useCallback(
    (nodeId) => {
      const toSelectNode = nodeMap.get(nodeId);

      // Unable to select field simultaneously with groups
      if (!toSelectNode.isContainable) {
        return toggleable.toggle([nodeId, ...selected.groups.map(get("nodeId"))]);
      }

      // Unable to select group simultaneously with groups and fields
      if (toSelectNode.isContainable) {
        return toggleable.toggle([
          nodeId,
          ...selected.groups.map(get("nodeId")),
          ...selected.fields.map(get("nodeId")),
        ]);
      }
    },
    [nodeMap, toggleable, selected]
  );

  return {
    selected,
    toggle,
    keys: toggleable.keys,
  };
};

const MasterSchema = () => {
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const nodeMap = hierarchy?.nodeMap || new Map();
  const selectable = useMasterSchemaSelectable(nodeMap);
  const context = useMemo(() => ({ selectable, unapproved }), [selectable, unapproved]);

  const onSelect = (nodeId) => selectable.toggle(nodeId);

  useDidUpdate(() => {
    selectable.clear();
  }, [selectedId]);

  return (
    <div className="d-flex master-schema-container">
      <MasterSchemaReactContext.Provider value={context}>
        <MasterSchemaContext hierarchy={hierarchy} onSelect={onSelect} selectedIds={selectable.keys} />
        <MasterSchemaContextFeature />
      </MasterSchemaReactContext.Provider>
    </div>
  );
};

export default MasterSchema;
