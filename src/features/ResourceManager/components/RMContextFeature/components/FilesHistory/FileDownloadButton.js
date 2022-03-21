import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import NmpButton from "components/nmp/NmpButton";

import DownloadIcon from "assets/img/icons/cloud-download.png";

import { useDownloadRMFile } from "../../../../resourceManagerQueries";

const FileDownloadButton = ({ name, fileId }) => {
  const downloadResource = useDownloadRMFile({ fileId, name });

  const onDownload = () => downloadResource.mutate();

  return (
    <NmpButton
      className="mr-1"
      size="sm"
      textColor="#95989a"
      backgroundColor="transparent"
      icon={<img src={DownloadIcon} alt="Download" />}
      onClick={onDownload}
      loading={downloadResource.isLoading}
    />
  );
};

FileDownloadButton.propTypes = {
  name: PropTypes.string.isRequired,
  fileId: IdType.isRequired,
};

export default FileDownloadButton;
