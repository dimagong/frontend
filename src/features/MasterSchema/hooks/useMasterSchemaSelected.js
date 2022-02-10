import _ from "lodash/fp";
import React from "react";

export const useMasterSchemaSelected = (selectedNodes) => {
  const someNodeIsSystem = React.useCallback(_.some(_.get("isSystem")), []);
  const filterGroups = React.useCallback(_.filter(_.get("isContainable")), []);
  const filterFields = React.useCallback(_.filter(_.negate(_.get("isContainable"))), []);
  const filterMemberFirmGroups = React.useCallback(_.filter(_.get("isMemberFirmGroup")), []);
  const filterMemberFirmFields = React.useCallback(_.filter(_.get("isMemberFirmField")), []);
  const areCommonAndMemberFirmFieldsSelected = React.useCallback(
    (selectedNodes) => {
      const selectedMemberFirmFields = filterMemberFirmFields(selectedNodes);
      return selectedNodes.length > selectedMemberFirmFields.length && selectedMemberFirmFields.length > 0;
    },
    [filterMemberFirmFields]
  );

  return React.useMemo(() => {
    const selectedGroups = filterGroups(selectedNodes);
    const selectedFields = filterFields(selectedNodes);

    return {
      node: selectedNodes[0],
      group: selectedGroups[0],
      field: selectedFields[0],
      nodes: selectedNodes,
      groups: selectedGroups,
      fields: selectedFields,
      memberFirmGroups: filterMemberFirmGroups(selectedNodes),
      thereIsSelectedSystemNode: someNodeIsSystem(selectedNodes),
      areSelectedFieldsContainCommonAndMemberFirmFields: areCommonAndMemberFirmFieldsSelected(selectedNodes),
    };
  }, [
    areCommonAndMemberFirmFieldsSelected,
    filterFields,
    filterGroups,
    filterMemberFirmGroups,
    selectedNodes,
    someNodeIsSystem,
  ]);
};
