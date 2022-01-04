import _ from "lodash/fp";
import { useEffect, useMemo } from "react";

import { useToggleable } from "hooks/use-toggleable";
import { useDidUpdate } from "../../../hooks/use-did-update";

const filterIncluded = (toFilter, included) => _.filter(_.negate(_.includes(_.__, included)))(toFilter);

// fixme: prevent cases when hierarchy is nullable
export const useMasterSchemaExpandable = (hierarchy) => {
  const masterSchemaId = hierarchy?.masterSchemaId;
  const initialKeys = hierarchy ? [hierarchy.nodeId] : [];

  const toggleable = useToggleable(initialKeys);

  const isDecedentsExpanded = useMemo(() => toggleable.keys.length > 1, [toggleable.keys]);

  const expandOnlyRoot = () => toggleable.setKeys(initialKeys);

  const expand = (node) => toggleable.setKeys((prev) => _.uniq([...prev, node.nodeId]));

  const collapse = (node) =>
    toggleable.setKeys((prev) => {
      const nodeIdsToCollapse = [];

      (function recursive(parent) {
        const groups = parent.groups.map((id) => hierarchy.nodeMap.get(id));

        nodeIdsToCollapse.push(...parent.groups);
        groups.forEach((group) => recursive(group));
      })(node);

      nodeIdsToCollapse.push(node.nodeId);

      return filterIncluded(prev, nodeIdsToCollapse);
    });

  const expandAll = () => toggleable.setKeys([...hierarchy.nodeMap.keys()]);

  // Reset keys when hierarchy.masterSchemaId changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useDidUpdate(() => toggleable.setKeys(initialKeys), [masterSchemaId]);

  return [
    {
      isDecedentsExpanded,
      expandedIds: toggleable.keys,
    },
    {
      toggle: toggleable.toggle,
      setKeys: toggleable.setKeys,
      expand,
      collapse,
      expandAll,
      expandOnlyRoot,
    },
  ];
};
