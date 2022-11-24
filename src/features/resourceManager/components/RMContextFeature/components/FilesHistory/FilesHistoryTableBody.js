import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import { useToggleable } from "hooks/use-toggleable";

import LatestFileItem from "./LatestFileItem";
import PreviousFileItem from "./PreviousFileItem";

const FilesHistoryTableBody = ({ fieldId, latestFile, previousFiles }) => {
  const [, expandable] = useToggleable([], { useRefactored: true });
  return (
    <ul className="items-list items-list--min-h-0">
      <LatestFileItem fieldId={fieldId} file={latestFile} expandable={expandable} />
      {previousFiles.map((file) => (
        <PreviousFileItem file={file} expandable={expandable} key={file.id} />
      ))}
    </ul>
  );
};

FilesHistoryTableBody.propTypes = {
  fieldId: IdType.isRequired,
  latestFile: PropTypes.object.isRequired,
  previousFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesHistoryTableBody;
