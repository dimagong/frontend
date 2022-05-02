import { PropTypes } from "prop-types";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

import masterSchemaApi from "api/masterSchema/masterSchema";

const style = { color: "currentColor" };

const FileValuePreview = ({ fileId, filename }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    masterSchemaApi
      .getValueFile({ valueId: fileId })
      .then((blob) => window.URL.createObjectURL(blob))
      .then((fileUrl) => isMounted && setFileUrl(fileUrl))
      .catch((error) => toast.error(error));

    return () => (isMounted = false);
  }, [fileId, filename]);

  if (!fileUrl) {
    return <span style={style}>{filename}</span>;
  }

  return (
    <a href={fileUrl} download={filename} style={style}>
      {filename}
    </a>
  );
};

FileValuePreview.propTypes = {
  fileId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  filename: PropTypes.string.isRequired,
};

export default FileValuePreview;
