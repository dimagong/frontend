import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import UploadRMFileModal from "./UploadRMFileModal";
import FilesHistoryTable from "./FilesHistoryTable";

import FileInfoFolderContentTemplate from "../FileInfoFolderContentTemplate";

const FilesHistory = ({ fieldId, files }) => {
  if (_.isEmpty(files)) {
    return (
      <FileInfoFolderContentTemplate title="Parent File Version" noDataTitle="No versions found">
        <UploadRMFileModal fieldId={fieldId} />
      </FileInfoFolderContentTemplate>
    );
  }

  return (
    <FileInfoFolderContentTemplate title="Parent File Version">
      <FilesHistoryTable fieldId={fieldId} files={files} />
      <UploadRMFileModal fieldId={fieldId} />
    </FileInfoFolderContentTemplate>
  );
};

FilesHistory.propTypes = {
  fieldId: IdType.isRequired,
  files: PropTypes.arrayOf(PropTypes.object),
};

export default FilesHistory;
