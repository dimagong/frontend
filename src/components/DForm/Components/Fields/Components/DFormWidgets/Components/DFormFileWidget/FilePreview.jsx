import React from "react";
import PropTypes from "prop-types";

import { NpmFileLoading } from "features/nmp-ui";

export const FilePreview = (props) => {
  const { name, isRemoving, isRemovable, isUploading, isDownloading, onRemove, onDownload } = props;

  return (
    <div style={{ padding: "5px 0" }}>
      <NpmFileLoading
        name={name}
        removing={isRemoving}
        uploading={isUploading}
        downloading={isDownloading}
        removable={isRemovable}
        onRemove={onRemove}
        onDownload={onDownload}
      />
    </div>
  );
};

FilePreview.propTypes = {
  name: PropTypes.string.isRequired,
  isRemoving: PropTypes.bool,
  isUploading: PropTypes.bool,
  isRemovable: PropTypes.bool,
  isDownloading: PropTypes.bool,
  onRemove: PropTypes.func,
  onDownload: PropTypes.func,
};
