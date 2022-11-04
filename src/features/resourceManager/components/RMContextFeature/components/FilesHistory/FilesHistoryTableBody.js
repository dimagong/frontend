import React from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";

import { IdType } from "utility/prop-types";
import { useToggleable } from "hooks/use-toggleable";

import LatestFileItem from "./LatestFileItem";
import PreviousFileItem from "./PreviousFileItem";

const FilesHistoryTableBody = ({ fieldId, latestFile, previousFiles }) => {
  const [, expandable] = useToggleable([], { useRefactored: true });

  return (
    <Scrollbars autoHeight autoHeightMax={350}>
      <ul className="items-list">
        <LatestFileItem fieldId={fieldId} file={latestFile} expandable={expandable} />

        {previousFiles.map((file) => (
          <PreviousFileItem file={file} expandable={expandable} key={file.id} />
        ))}
      </ul>
    </Scrollbars>
  );
};

FilesHistoryTableBody.propTypes = {
  fieldId: IdType.isRequired,
  latestFile: PropTypes.object.isRequired,
  previousFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilesHistoryTableBody;
