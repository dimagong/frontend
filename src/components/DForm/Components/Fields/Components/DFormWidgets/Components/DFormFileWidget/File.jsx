import "./style.scss";

import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import NpmDragAndDrop from "features/nmp-ui/NpmDragAndDrop";

import { FilesPreview } from "./FilesPreview";

export const File = (props) => {
  const {
    value = [],
    isLoading = false,
    isDisabled,
    isMultiple = false,
    previewFile,
    uploadingFiles = [],
    isUploadable = true,
    onChange,
  } = props;

  const files = Array.from(value);

  const onFileChange = (fileData) => onChange(fileData.fileList);

  const isDropZoneShown = isUploadable && (isMultiple || files.length < 1);

  return (
    <>
      <FilesPreview files={files} previewFile={previewFile} uploadingFiles={uploadingFiles} />

      {isDropZoneShown ? (
        <NpmDragAndDrop
          multiple={isMultiple}
          disabled={isDisabled || isLoading}
          onDrop={onFileChange}
          onChange={onFileChange}
          beforeUpload={() => false}
          showUploadList={false}
        />
      ) : null}
    </>
  );
};

File.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, file_id: IdType })),
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool.isRequired,
  isMultiple: PropTypes.bool,
  isUploadable: PropTypes.bool,
  uploadingFiles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
  previewFile: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};
