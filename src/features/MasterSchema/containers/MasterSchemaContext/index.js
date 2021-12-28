import React from "react";
import PropTypes from "prop-types";

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";

const MasterSchemaContext = ({ hierarchy, unapproved, selectedIds, onSelect }) => {
  return (
    <MasterSchemaContextComponent
      hierarchy={hierarchy}
      unapproved={unapproved}
      selectedIds={selectedIds}
      onSelect={onSelect}
    />
  );
};

MasterSchemaContext.propTypes = {
  hierarchy: PropTypes.object,
  unapproved: PropTypes.array,

  onSelect: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};

export default MasterSchemaContext;
