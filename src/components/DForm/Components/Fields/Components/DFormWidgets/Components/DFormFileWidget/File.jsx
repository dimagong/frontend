import "./style.scss";

import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

import { IdType } from "utility/prop-types";

import { FilesPreview } from "./FilesPreview";

import NpmDragAndDrop from "./../../../../../../../../features/nmp-ui/NpmDragAndDrop";

const reader = new FileReader();

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

  const [progress, calculateProgress] = useState(0);

  const files = Array.from(value);

  const inputFileRef = useRef();
  // const onInputFileChangeDrop = (files) => {
  //   console.log("onInputFileChangeDrop files", files, typeof files[0]);
  // };

  const onInputFileChange = (fileData) => {
    //const files = event.target.files;
    const { file, fileList } = fileData;
    // onChange(event.target.files);
    onChange(fileList);
    reader.readAsDataURL(file);
    reader.addEventListener("progress", (event) => {
      if (event.loaded && event.total) {
        const percent = (event.loaded / event.total) * 100;
        calculateProgress(percent);
      }
    });
  };

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
      <FilesPreview files={files} previewFile={previewFile} uploadingFiles={uploadingFiles} progress={progress} />

      {isDropZoneShown ? (
        <>
          <div>
            <NpmDragAndDrop
              onChange={onInputFileChange}
              onDrop={onInputFileChange}
              disabled={isDisabled || isLoading}
              multiple={isMultiple}
              name="file"
              beforeUpload={() => false}
              showUploadList={false}
            />
          </div>
        </>
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
