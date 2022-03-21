import _ from "lodash/fp";
import { useEffect, useMemo, useCallback } from "react";

import { useToggleable } from "hooks/use-toggleable";

const filterIncluded = (toFilter, included) => _.filter(_.negate(_.includes(_.__, included)))(toFilter);

export const useTreeHierarchyExpandable = (hierarchy) => {
  const nodes = useMemo(() => hierarchy ? hierarchy.nodes : [], [hierarchy]);
  const initialKeys = useMemo(() => hierarchy ? [hierarchy.nodeId] : [], [hierarchy]);

  const [keys, { setKeys, toggle }] = useToggleable([], { useRefactored: true });

  const isDecedentsExpanded = useMemo(() => keys.length > 1, [keys]);

  const expandOnlyRoot = useCallback(() => setKeys(initialKeys), [initialKeys, setKeys]);

  const expand = useCallback((node) => setKeys((prev) => _.uniq([...prev, node.nodeId])), [setKeys]);

  const collapse = useCallback(
    (node) => {
      setKeys((prev) => {
        const nodeIdsToCollapse = [];

        (function recursive(parent) {
          const groups = parent.groups.map((id) => nodes[id]);

          nodeIdsToCollapse.push(...parent.groups);
          groups.forEach((group) => recursive(group));
        })(node);

        nodeIdsToCollapse.push(node.nodeId);

        return filterIncluded(prev, nodeIdsToCollapse);
      });
    },
    [nodes, setKeys]
  );

  const expandAll = useCallback(() => {
    setKeys(_.pipe(_.filter(_.get("isContainable")), _.map(_.get("nodeId")))(nodes));
  }, [nodes, setKeys]);

  // Expand only root on hierarchy change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => expandOnlyRoot(), [hierarchy?.id]);

  return {
    isDecedentsExpanded,
    expandedIds: keys,
    toggle: toggle,
    setKeys,
    expand,
    collapse,
    expandAll,
    expandOnlyRoot,
  };
};
