import _ from "lodash/fp";
import React from "react";
import { useToggleable } from "hooks/use-toggleable";

const filterGroups = _.filter((node) => node.isContainable);
const filterFields = _.filter((node) => !node.isContainable);

const useMasterSchemaSelectStrategies = (nodes, toggle) => {
  const singleGroupAndMultipleFields = React.useCallback(
    (node) => {
      const groups = filterGroups(nodes);

      // Unable to select field simultaneously with groups
      if (!node.isContainable) {
        return toggle([node, ...groups]);
      }

      // Unable to select group simultaneously with groups and fields
      if (node.isContainable) {
        const fields = filterFields(nodes);

        return toggle([node, ...groups, ...fields]);
      }
    },
    [nodes, toggle]
  );

  const onlySingleField = React.useCallback(
    (node) => {
      const fields = filterFields(nodes);

      // Unable to select field simultaneously with groups
      if (!node.isContainable) {
        return toggle([node, ...fields]);
      }
    },
    [nodes, toggle]
  );

  return React.useMemo(
    () => ({
      [useMasterSchemaSelectable.Stratagy.OnlySingleField]: onlySingleField,
      [useMasterSchemaSelectable.Stratagy.SingleGroupAndMultipleFields]: singleGroupAndMultipleFields,
    }),
    [onlySingleField, singleGroupAndMultipleFields]
  );
};

export const useMasterSchemaSelectable = (strategyId) => {
  const [nodes, { isEmpty, clear, toggle, setKeys, includes }] = useToggleable([], { useRefactored: true });

  const strategies = useMasterSchemaSelectStrategies(nodes, toggle);
  const selectStrategy = React.useMemo(() => strategies[strategyId], [strategies, strategyId]);

  const selectStrategyWrapper = (valueProp) => {
    const containedNode = nodes.find((node) => node.id === valueProp.id);

    if (containedNode) {
      toggle(containedNode);
    } else {
      selectStrategy(valueProp);
    }
  };

  return [
    nodes,
    {
      isEmpty,
      clear,
      select: selectStrategyWrapper,
      setKeys,
      includes,
    },
  ];
};

useMasterSchemaSelectable.Stratagy = {
  OnlySingleField: Symbol("OnlySingleField"),
  SingleGroupAndMultipleFields: Symbol("SingleGroupAndMultipleFields"),
};
