import React from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";

import { useToggleable } from "hooks/use-toggleable";

import LatestVersionItem from "./LatestVersionItem";
import PreviousVersionsList from "./PreviousVersionsList";

const PreviousVersions = ({ field, latestVersion, previousVersions }) => {
  const [, expandable] = useToggleable([], { useRefactored: true });

  if (latestVersion == null) {
    return (
      <strong className="d-flex justify-content-center pt-5 text-black-50 font-large-1 pb-5">No versions found</strong>
    );
  }

  return (
    <Scrollbars autoHeight autoHeightMax={350}>
      <PreviousVersionsList versions={previousVersions} expandable={expandable}>
        <LatestVersionItem version={latestVersion} expandable={expandable} field={field} />
      </PreviousVersionsList>
    </Scrollbars>
  );
};

PreviousVersions.propTypes = {
  field: PropTypes.object.isRequired,
  latestVersion: PropTypes.object,
  previousVersions: PropTypes.arrayOf(PropTypes.object),
};

export default PreviousVersions;
