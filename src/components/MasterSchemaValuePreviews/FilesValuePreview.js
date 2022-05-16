import React from "react";
import { PropTypes } from "prop-types";

import FileValuePreview from "./FileValuePreview";

const FilesValuePreview = ({ files }) => {
  return files.map(({ id, name }, key) =>
    (<p>
      <FileValuePreview fileId={id} filename={name} key={name} />
      {key !== files.length - 1 ? ', ' : '.'}
    </p>));
};

FilesValuePreview.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesValuePreview;
