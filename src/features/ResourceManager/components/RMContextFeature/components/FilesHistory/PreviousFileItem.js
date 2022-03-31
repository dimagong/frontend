import React from "react";
import PropTypes from "prop-types";

import { useDownloadRMFile } from "api/resourceManager/useRMFieldFiles";

import FileItem from "./FileItem";
import FileDownloadButton from "./FileDownloadButton";

const PreviousFileItem = ({ file, expandable, ...attrs }) => {
  const downloadRMFIle = useDownloadRMFile({ fileId: file.id, filename: file.name });

  return (
    <FileItem
      file={file}
      expandable={expandable}
      controls={<FileDownloadButton onDownload={downloadRMFIle.mutate} isLoading={downloadRMFIle.isLoading} />}
      {...attrs}
    />
  );
};

PreviousFileItem.propTypes = {
  file: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
};

export default PreviousFileItem;
