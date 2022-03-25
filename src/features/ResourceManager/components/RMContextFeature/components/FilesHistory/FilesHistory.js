import _ from "lodash/fp";
import React from "react";

import { IdType } from "utility/prop-types";

import UploadRMFileModal from "./UploadRMFileModal";
import FilesHistoryTable from "./FilesHistoryTable";

import FileInfoFolderContentTemplate from "../FileInfoFolderContentTemplate";

import { useRMFieldFiles } from "../../../../resourceManagerQueries";

const FilesHistory = ({ fieldId }) => {
  // Warning: here is not using isLoading cause this prefetched in RMContextFeature
  const { data: files } = useRMFieldFiles({ fieldId });

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
};

export default FilesHistory;
