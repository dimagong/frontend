import React from "react";

import { IdType } from "utility/prop-types";

import FilesHistoryTemplate from "./FilesHistoryTemplate";

const FilesHistoryNoData = ({ fieldId }) => {
  return (
    <FilesHistoryTemplate fieldId={fieldId}>
      <strong className="d-flex justify-content-center pt-5 text-black-50 font-large-1 pb-5">
        No versions found
      </strong>
    </FilesHistoryTemplate>
  );
};

FilesHistoryNoData.propTypes = {
  fieldId: IdType.isRequired,
};

export default FilesHistoryNoData;
