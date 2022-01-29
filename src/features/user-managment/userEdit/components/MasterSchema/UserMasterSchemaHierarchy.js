import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";

import { TreeHierarchy } from "components/TreeHierarchy";

const UserMasterSchemaHierarchy = (props) => {
  const {
    isLoading,
    hierarchy,
    expandedIds,
    onExpand,
    onCollapse,
    selectedIds,
    onSelect,
    elementCreationLoading,
    onElementCreationSubmit,
  } = props;

  if (!hierarchy && isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  if (!hierarchy) {
    return (
      <h1 className="text-center w-100 mb-0" style={{ color: "#707070" }}>
        Nothing was found for your query.
      </h1>
    );
  }

  return (
    <TreeHierarchy
      hierarchy={hierarchy}
      expandedIds={expandedIds}
      onExpand={onExpand}
      onCollapse={onCollapse}
      selectedIds={selectedIds}
      onSelect={onSelect}
      elementCreationLoading={elementCreationLoading}
      onElementCreationSubmit={onElementCreationSubmit}
    />
  );
};

UserMasterSchemaHierarchy.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  hierarchy: PropTypes.object.isRequired,

  expandedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onExpand: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,

  onSelect: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,

  elementCreationLoading: PropTypes.bool.isRequired,
  onElementCreationSubmit: PropTypes.func.isRequired,
};

export default UserMasterSchemaHierarchy;