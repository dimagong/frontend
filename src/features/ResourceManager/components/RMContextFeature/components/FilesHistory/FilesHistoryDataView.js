import React from "react";

import { IdType } from "utility/prop-types";

import FilesHistoryTable from "./FilesHistoryTable";
import FilesHistoryTemplate from "./FilesHistoryTemplate";

const FilesHistoryDataView = ({ fieldId, files }) => {
  return (
    <FilesHistoryTemplate fieldId={fieldId}>
      <div className="d-flex align-items-center">
        <strong className="d-block font-size-large">Parent File Version</strong>
      </div>

      <FilesHistoryTable fieldId={fieldId} files={files} />
    </FilesHistoryTemplate>
  );
};

FilesHistoryDataView.propTypes = {
  fieldId: IdType.isRequired,
  files: IdType.isRequired,
};

export default FilesHistoryDataView;
