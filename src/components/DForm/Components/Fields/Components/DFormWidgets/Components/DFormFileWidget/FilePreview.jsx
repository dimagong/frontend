import { X } from "react-feather";
import PropTypes from "prop-types";
import { Badge, Spinner } from "reactstrap";
import React, { useEffect, useState } from "react";

import NpmProgress from "./../../../../../../../../features/nmp-ui/NpmProgress";
import NpmFileLoading from "./../../../../../../../../features/nmp-ui/NpmFileLoading";

const FilePreviewStatusTypes = {
  Removing: "removing",
  Uploading: "uploading",
  Downloaded: "downloaded",
  Downloading: "downloading",
};

const getStatus = ({ isRemoving, isUploading, isDownloading }) => {
  const truth = [
    [FilePreviewStatusTypes.Removing, isRemoving],
    [FilePreviewStatusTypes.Uploading, isUploading],
    [FilePreviewStatusTypes.Downloading, isDownloading],
  ].filter(([, bool]) => bool === true);

  if (truth.length === 0) {
    return FilePreviewStatusTypes.Downloaded;
  }

  // It should be impossible to get two or more processes at one time.
  if (truth.length > 1) {
    throw new Error("Unexpected: FilePreview's status can not be uploading, or downloading, or removing at one time.");
  }

  return truth[0][0];
};

const getBadgeMessage = (status) => {
  switch (status) {
    case FilePreviewStatusTypes.Removing:
      return "Removing";
    case FilePreviewStatusTypes.Uploading:
      return "Uploading";
    case FilePreviewStatusTypes.Downloading:
      return "Downloading";
    case FilePreviewStatusTypes.Downloaded:
    default:
      return "Download";
  }
};

export const FilePreview = (props) => {
  const {
    file,
    name,
    isRemoving = false,
    isRemovable = true,
    isUploading = false,
    isDownloading = false,
    onRemove,
    progress,
  } = props;

  console.log("FilePreview props", props);

  const status = getStatus({ isRemoving, isUploading, isDownloading });
  const badgeMessage = getBadgeMessage(status);
  const color = isRemoving ? "danger" : "primary";

  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (file == null) return;

    const fileUrl = URL.createObjectURL(file);

    setFileUrl(fileUrl);

    return () => URL.revokeObjectURL(fileUrl);
  }, [file]);

  const onRemoveButtonClick = () => {
    console.log("onRemoveButtonClick");
    onRemove();
  };

  const desableClick = isUploading || isDownloading || isRemoving;

  return (
    <div style={{ padding: "5px 0" }}>
      <NpmFileLoading
        percent={progress}
        fileName={name}
        onClick={desableClick ? () => {} : () => onRemoveButtonClick()}
      />
    </div>
  );
};

FilePreview.propTypes = {
  file: PropTypes.instanceOf(File),
  name: PropTypes.string.isRequired,
  isRemoving: PropTypes.bool,
  isUploading: PropTypes.bool,
  isRemovable: PropTypes.bool,
  isDownloading: PropTypes.bool,
  onRemove: PropTypes.func,
};
