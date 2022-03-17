import React from "react";
import PropTypes from "prop-types";
import { useMutation } from "react-query";

import NmpButton from "components/nmp/NmpButton";

import { resourceManagerService } from "api/resourceManager";

import DownloadIcon from "assets/img/icons/cloud-download.png";

const VersionDownloadButton = ({ versionId, name, ...attrs }) => {
  const downloadResource = useMutation((payload) => resourceManagerService.downloadVersion(payload));

  const onDownload = () => downloadResource.mutate({ versionId, name });

  return (
    <NmpButton
      className="mr-1"
      size="sm"
      textColor="#95989a"
      backgroundColor="transparent"
      icon={<img src={DownloadIcon} alt="Download" />}
      onClick={onDownload}
      loading={downloadResource.isLoading}
      {...attrs}
    />
  );
};

VersionDownloadButton.propTypes = {
  versionId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default VersionDownloadButton;
