import "./styles.scss";

import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";

import Folders from "components/Folders";

import FilesHistory from "./components/FilesHistory";

import { useRMFieldFiles } from "../../resourceManagerQueries";
import RMContextFeatureTemplate from "./RMContextFeatureTemplate";

let folderId = 0;
const getFolder = (name, count, itemsName) => ({ id: folderId++, name, items: Array(count), itemsName });
const getFolders = ({ previousFilesCount }) => ({
  PreviousVersions: getFolder("Previous Versions", previousFilesCount, "revisions"),
  // SharedWith: getFolder("Shared With"),
  // Mapping: getFolder("Mapping"),
});

const RMContextFeatureDataView = ({ field }) => {
  // Warning: here is a fallback, so, there is no need to handle nullable value
  // This query is need here to show the files count in Folder preview
  const { data: files = [] } = useRMFieldFiles({ fieldId: field.id });

  const folders = useMemo(() => getFolders({ previousFilesCount: files.length }), [files.length]);
  const foldersAsArray = useMemo(() => Object.values(folders), [folders]);
  const [selectedFolder, setSelectedFolder] = useState(folders.PreviousVersions);

  return (
    <RMContextFeatureTemplate field={field}>
      <div className="mt-3">
        <Folders onFolderSelect={setSelectedFolder} folders={foldersAsArray} selectedFolder={selectedFolder} />
      </div>

      {
        {
          "Previous Versions": <FilesHistory fieldId={field.id} />,
        }[selectedFolder.name]
      }
    </RMContextFeatureTemplate>
  );
};

RMContextFeatureDataView.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeatureDataView;
