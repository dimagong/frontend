import React from "react";
import PropTypes from "prop-types";

import NmpButton from "components/nmp/NmpButton";

import { ResourceManagerPreviousVersionService } from "api/resourceManager/resourceManagerPreviousVersionService";

import DownloadIcon from "assets/img/icons/cloud-download.png";

const VersionDownloadButton = ({ versionId, name, ...attrs }) => {
  const onDownload = () => ResourceManagerPreviousVersionService.downloadVersion({ versionId, name });

  return (
    <NmpButton
      className="mr-1"
      size="sm"
      backgroundColor="transparent"
      icon={<img src={DownloadIcon} alt="Download" />}
      onClick={onDownload}
      {...attrs}
    />
  );
};

VersionDownloadButton.propTypes = {
  versionId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default VersionDownloadButton;
