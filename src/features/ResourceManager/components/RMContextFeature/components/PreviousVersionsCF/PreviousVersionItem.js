import React from "react";
import PropTypes from "prop-types";

import VersionItem from "./VersionItem";
import VersionDownloadButton from "./VersionDownloadButton";

const PreviousVersionItem = ({ version, expandable, ...attrs }) => {
  return (
    <VersionItem
      version={version}
      expandable={expandable}
      controls={<VersionDownloadButton versionId={version.id} name={version.name} />}
      {...attrs}
    />
  );
};

PreviousVersionItem.propTypes = {
  version: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
};

export default PreviousVersionItem;
