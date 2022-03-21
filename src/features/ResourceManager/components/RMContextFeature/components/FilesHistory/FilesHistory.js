import React from "react";

import { IdType } from "utility/prop-types";

import FilesHistoryNoData from "./FilesHistoryNoData";
import FilesHistoryDataView from "./FilesHistoryDataView";

import { useRMFieldFiles } from "../../../../resourceManagerQueries";

const FilesHistory = ({ fieldId }) => {
  const { data: files } = useRMFieldFiles({ fieldId });

  if (files == null || files.length === 0) {
    return <FilesHistoryNoData fieldId={fieldId} />;
  }

  return <FilesHistoryDataView fieldId={fieldId} files={files} />;
};

FilesHistory.propTypes = {
  fieldId: IdType.isRequired,
};

export default FilesHistory;
