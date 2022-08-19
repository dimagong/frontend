import { X } from "react-feather";
import PropTypes from "prop-types";
import { Badge, Spinner } from "reactstrap";
import React, { useEffect, useState } from "react";

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
  const { file, name, isRemoving = false, isUploading = false, isDownloading = false, onRemove } = props;

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

  const onRemoveButtonClick = () => onRemove();

  if (isUploading || isDownloading || isRemoving) {
    return (
      <div className="d-flex align-items-center dform-file__item">
        <div className="width-80-per dform-file__item-name">{name}</div>

        <div className="d-flex justify-content-end align-items-center dform-file__item-actions">
          <Badge color={color} className="ml-1 mr-1">
            {badgeMessage}
          </Badge>

          <Spinner size="sm" color={color} />
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center dform-file__item">
      <div className="d-block dform-file__item-name">{name}</div>

      <div className="d-flex justify-content-end align-items-center dform-file__item-actions">
        <Badge color={color} tag="a" href={fileUrl} target="_blank" rel="noreferrer" className="ml-1 mr-1 text-white">
          {badgeMessage}
        </Badge>

        <button className="dform-file__item-remove-btn" type="button" onClick={onRemoveButtonClick}>
          <X size="15" />
        </button>
      </div>
    </div>
  );
};

FilePreview.propTypes = {
  file: PropTypes.instanceOf(File),
  name: PropTypes.string.isRequired,
  isRemoving: PropTypes.bool,
  isUploading: PropTypes.bool,
  isDownloading: PropTypes.bool,
  onRemove: PropTypes.func,
};
