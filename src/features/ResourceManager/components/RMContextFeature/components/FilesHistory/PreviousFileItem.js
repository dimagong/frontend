import React from "react";
import PropTypes from "prop-types";

import FileItem from "./FileItem";
import FileDownloadButton from "./FileDownloadButton";

const PreviousFileItem = ({ file, expandable, ...attrs }) => {
  return (
    <FileItem
      file={file}
      expandable={expandable}
      controls={<FileDownloadButton name={file.name} fileId={file.id} />}
      {...attrs}
    />
  );
};

PreviousFileItem.propTypes = {
  file: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
};

export default PreviousFileItem;
