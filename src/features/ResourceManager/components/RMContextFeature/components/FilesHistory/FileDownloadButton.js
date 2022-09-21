import React from "react";
import PropTypes from "prop-types";

import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";

import DownloadIcon from "assets/img/icons/cloud-download.png";

const FileDownloadButton = ({ onDownload, isLoading }) => {
  return (
    <DeprecatedNmpButton
      className="mr-1"
      size="sm"
      textColor="#95989a"
      backgroundColor="transparent"
      icon={<img src={DownloadIcon} alt="Download" />}
      onClick={onDownload}
      loading={isLoading}
    />
  );
};

FileDownloadButton.propTypes = {
  onDownload: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default FileDownloadButton;
