import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import { FilePreview } from "./FilePreview";

export const FilesPreview = (props) => {
  const { files, uploadingFiles, previewFile } = props;

  if (files.length + uploadingFiles.length === 0) {
    return null;
  }

  return (
    <div className="mb-2">
      {files.map((file, index) => previewFile(file, index))}

      {uploadingFiles.map((file, idx) => (
        <FilePreview name={file.name} isUploading key={`loading-${idx}`} />
      ))}
    </div>
  );
};

FilesPreview.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, file_id: IdType.isRequired }))
    .isRequired,
  uploadingFiles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })).isRequired,
  previewFile: PropTypes.func.isRequired,
};
