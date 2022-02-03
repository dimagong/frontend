import React from "react";
import { PropTypes } from "prop-types";

import FileValuePreview from "./FileValuePreview";

const FilesValuePreview = ({ files }) => {
  return files.map(({ id, name }) => <FileValuePreview fileId={id} filename={name} key={name} />);
};

FilesValuePreview.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesValuePreview;
