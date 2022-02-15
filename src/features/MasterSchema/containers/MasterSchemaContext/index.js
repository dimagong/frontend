import React from "react";
import PropTypes from "prop-types";

import ContextTemplate from "components/ContextTemplate";
import MasterSchemaHierarchy from "components/MasterSchemaHierarchy";

import UnapprovedFields from "components/UnapprovedFields";

const MasterSchemaContext = ({ masterSchemaId, selectedNodes, onSelect }) => {
  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      <UnapprovedFields masterSchemaId={masterSchemaId} />
      <MasterSchemaHierarchy masterSchemaId={masterSchemaId} selectedNodes={selectedNodes} onSelect={onSelect} />
    </ContextTemplate>
  );
};

MasterSchemaContext.propTypes = {
  masterSchemaId: PropTypes.number.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MasterSchemaContext;
