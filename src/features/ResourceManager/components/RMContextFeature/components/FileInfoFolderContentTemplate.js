import React from "react";
import PropTypes from "prop-types";

const FileInfoFolderContentTemplate = ({ title, noDataTitle, children }) => {
  return (
    <div>
      <h2 className="h1 font-weight-bold mb-2">{title}</h2>

      {noDataTitle ? (
        <strong className="d-flex justify-content-center pt-5 text-black-50 font-large-1 pb-5">{noDataTitle}</strong>
      ) : null}

      {children}
    </div>
  );
};

FileInfoFolderContentTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  noDataTitle: PropTypes.string,
};

export default FileInfoFolderContentTemplate;
