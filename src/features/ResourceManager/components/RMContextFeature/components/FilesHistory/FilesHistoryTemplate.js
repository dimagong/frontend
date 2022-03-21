import React from "react";

import { IdType } from "utility/prop-types";

import UploadRMFileModal from "./UploadRMFileModal";

const FilesHistoryTemplate = ({ fieldId, children }) => {
  return (
    <div>
      {children}
      <UploadRMFileModal fieldId={fieldId} />
    </div>
  );
};

FilesHistoryTemplate.propTypes = {
  fieldId: IdType.isRequired,
};

export default FilesHistoryTemplate;
