import { useCallback, useMemo } from "react";

import { useExpandable } from "./useExpandable";

export const useExpandableHierarchy = (hierarchy) => {
  const [{ expandedIds }, { expand, collapse, setExpandedIds }] = useExpandable([hierarchy.nodeId]);

  const isExpandedOnlyRoot = useMemo(() => {
    return expandedIds.includes(hierarchy.nodeId) && expandedIds.length === 1;
  }, [expandedIds, hierarchy.nodeId]);

  const expandNode = useCallback((node) => expand(node.nodeId), [expand]);

  const expandAllNodes = useCallback(
    () => setExpandedIds(Object.keys(hierarchy.nodes)),
    [hierarchy.nodes, setExpandedIds]
  );

  const collapseNode = useCallback((node) => collapse(node.nodeId), [collapse]);

  const collapseAllExceptRoot = useCallback(() => {
    setExpandedIds([hierarchy.nodeId]);
  }, [hierarchy.nodeId, setExpandedIds]);

  return [
    { expandedIds, isExpandedOnlyRoot },
    { expandNode, expandAllNodes, collapseNode, collapseAllExceptRoot },
  ];
};
