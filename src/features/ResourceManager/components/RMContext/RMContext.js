import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import RMContextNoData from "./RMContextNoData";
import RMContextLoading from "./RMContextLoading";
import RMContextDataView from "./RMContextDataView";

import { useRMHierarchy } from "api/resourceManager/useRMHierarchies";

const RMContext = ({ resourceManagerId, selectedIds, onSelect }) => {
  const { data: hierarchy, isLoading } = useRMHierarchy({ resourceManagerId });

  if (isLoading) {
    return <RMContextLoading />;
  }

  if (hierarchy == null) {
    return <RMContextNoData />;
  }

  return (
    <RMContextDataView
      resourceManagerId={resourceManagerId}
      hierarchy={hierarchy}
      selectedIds={selectedIds}
      onSelect={onSelect}
    />
  );
};

RMContext.propTypes = {
  selectedIds: PropTypes.arrayOf(IdType).isRequired,
  onSelect: PropTypes.func.isRequired,
  resourceManagerId: IdType.isRequired,
};

export default RMContext;
