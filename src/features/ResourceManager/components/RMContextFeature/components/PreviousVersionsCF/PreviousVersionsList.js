import React from "react";
import PropTypes from "prop-types";

import PreviousVersionItem from "./PreviousVersionItem";

const PreviousVersionsList = ({ versions, expandable, children }) => {
  return (
    <ul className="items-list">
      {children}

      {versions.map((version) => (
        <PreviousVersionItem version={version} expandable={expandable} key={version.id} />
      ))}
    </ul>
  );
};

PreviousVersionsList.propTypes = {
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
  expandable: PropTypes.object.isRequired,
};

export default PreviousVersionsList;
