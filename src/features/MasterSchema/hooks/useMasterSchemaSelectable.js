import _ from "lodash/fp";
import React from "react";
import { useToggleable } from "hooks/use-toggleable";

export const useMasterSchemaSelectable = () => {
  const [nodes, { isEmpty, clear, toggle, setKeys, includes }] = useToggleable([], { useRefactored: true });

  const filterContainableNodes = React.useCallback(
    _.filter((node) => node.isContainable),
    []
  );
  const filterNotContainableNodes = React.useCallback(
    _.filter((node) => !node.isContainable),
    []
  );

  const hierarchyToggle = React.useCallback(
    (node) => {
      const containableNodes = filterContainableNodes(nodes);

      // Unable to select field simultaneously with groups
      if (!node.isContainable) {
        return toggle([node, ...containableNodes]);
      }

      // Unable to select group simultaneously with groups and fields
      if (node.isContainable) {
        const notContainableNodes = filterNotContainableNodes(nodes);

        return toggle([node, ...containableNodes, ...notContainableNodes]);
      }
    },
    [filterContainableNodes, filterNotContainableNodes, nodes, toggle]
  );

  return [
    nodes,
    {
      isEmpty,
      clear,
      toggle: hierarchyToggle,
      setKeys,
      includes,
    },
  ];
};
