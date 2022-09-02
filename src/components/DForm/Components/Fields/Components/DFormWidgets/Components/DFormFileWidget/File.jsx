import "./style.scss";

import PropTypes from "prop-types";
import React, { useRef } from "react";

import { IdType } from "utility/prop-types";

import { FilesPreview } from "./FilesPreview";

export const File = (props) => {
  const {
    id,
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

  const inputFileRef = useRef();

  const onInputFileChange = (event) => onChange(event.target.files);

  const onDropZoneClick = () => {
    const inputFileElement = inputFileRef.current;

    if (inputFileElement && inputFileElement instanceof HTMLInputElement) {
      // Trigger click event on input element - leads to open browser's file manager.
      // User can close browser's file manager or select file/files.
      inputFileElement.click();
    }
  };

  const isDropZoneShown = isUploadable && (isMultiple || files.length < 1);

  return (
    <>
      <FilesPreview files={files} previewFile={previewFile} uploadingFiles={uploadingFiles} />

      {isDropZoneShown ? (
        <div
          className="d-flex align-items-center justify-content-center p-1 dform-file__drop-zone"
          onClick={onDropZoneClick}
        >
          <span>Drag 'n' Drop files here or click to open file manager</span>

          <input
            id={id}
            type="file"
            multiple={isMultiple}
            disabled={isDisabled || isLoading}
            onChange={onInputFileChange}
            className="dform-file__input"
            ref={inputFileRef}
          />
        </div>
      ) : null}
    </>
  );
};

File.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, file_id: IdType })),
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool.isRequired,
  isMultiple: PropTypes.bool,
  isUploadable: PropTypes.bool,
  uploadingFiles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
  previewFile: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};
