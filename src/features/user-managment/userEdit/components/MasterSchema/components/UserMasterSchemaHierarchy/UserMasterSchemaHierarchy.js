import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";

import { useMasterSchemaHierarchyByUser } from "api/masterSchema/hierarchy/masterSchemaHierarchyQueries";

import { useHierarchyByUserSearch } from "./hooks/useHierarchyByUserSearch";

import UserMasterSchemaHierarchyData from "./UserMasterSchemaHierarchyData";
import UserMasterSchemaHierarchyNoData from "./UserMasterSchemaHierarchyNoData";
import UserMasterSchemaHierarchyLoading from "./UserMasterSchemaHierarchyLoading";
import UserMasterSchemaHierarchyTemplate from "./UserMasterSchemaHierarchyTemplate";

function UserMasterSchemaHierarchy(props) {
  const { userId, organizationName, selectedNodes, onSelect } = props;

  const selectedIds = React.useMemo(() => selectedNodes.map(_.get("nodeId")), [selectedNodes]);

  const [hierarchyParams, setHierarchyParams] = useHierarchyByUserSearch(userId);
  const { data: hierarchy, isLoading: isHierarchyLoading } = useMasterSchemaHierarchyByUser(hierarchyParams, {
    notifyOnChangeProps: ["data", "isLoading"],
  });

  if (hierarchy) {
    return (
      <UserMasterSchemaHierarchyTemplate onSearch={setHierarchyParams} organizationName={organizationName}>
        <UserMasterSchemaHierarchyData
          hierarchy={hierarchy}
          hierarchyParams={hierarchyParams}
          selectedIds={selectedIds}
          onSelect={onSelect}
        />
      </UserMasterSchemaHierarchyTemplate>
    );
  }

  if (isHierarchyLoading) {
    return (
      <UserMasterSchemaHierarchyTemplate onSearch={setHierarchyParams} organizationName={organizationName}>
        <UserMasterSchemaHierarchyLoading />
      </UserMasterSchemaHierarchyTemplate>
    );
  }

  return (
    <UserMasterSchemaHierarchyTemplate onSearch={setHierarchyParams} organizationName={organizationName}>
      <UserMasterSchemaHierarchyNoData />
    </UserMasterSchemaHierarchyTemplate>
  );
}

UserMasterSchemaHierarchy.propTypes = {
  userId: PropTypes.number.isRequired,
  organizationName: PropTypes.string.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UserMasterSchemaHierarchy;
