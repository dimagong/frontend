import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import FilesHistoryTableBody from "./FilesHistoryTableBody";

const HEADERS = ["Action", "Version", "Users", "Date", "Author"];

const FilesHistoryTable = ({ fieldId, files }) => {
  const { latestFile, previousFiles } = React.useMemo(() => {
    const previousFiles = [...files];
    const latestFile = previousFiles.shift();
    return { latestFile, previousFiles };
  }, [files]);

  return (
    <div>
      <div className="list-header">
        {HEADERS.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>

      <FilesHistoryTableBody fieldId={fieldId} latestFile={latestFile} previousFiles={previousFiles} />
    </div>
  );
};

FilesHistoryTable.propTypes = {
  fieldId: IdType.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesHistoryTable;
