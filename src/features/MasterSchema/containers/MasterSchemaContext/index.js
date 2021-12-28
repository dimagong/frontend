import React from "react";
import PropTypes from "prop-types";

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";

const MasterSchemaContext = ({ hierarchy, selectedIds, onSelect }) => {
  return <MasterSchemaContextComponent hierarchy={hierarchy} selectedIds={selectedIds} onSelect={onSelect} />;
};

MasterSchemaContext.propTypes = {
  hierarchy: PropTypes.object,

  onSelect: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};

export default MasterSchemaContext;
