import "./styles.scss";

import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";

import Folders from "components/Folders";

import MSMapping from "./components/MSMapping";
import FilesHistory from "./components/FilesHistory";
import RMContextFeatureTemplate from "./RMContextFeatureTemplate";

import { useRMFieldFiles } from "api/resourceManager/useRMFieldFiles";
import { useRMFieldFileReferences } from "api/resourceManager/useRMFieldFileReferences";

const getFolder = (id, name, length, itemsName) => ({ id, name, items: { length }, itemsName });
const getFolders = ({ previousFilesCount, mappedElementsCount }) => ({
  PreviousVersions: getFolder(1, "Previous Versions", previousFilesCount, "revisions"),
  // SharedWith: getFolder("Shared With"),
  Mapping: getFolder(2, "MS Mapping", mappedElementsCount, "mapped elements"),
});

const RMContextFeatureDataView = ({ field, resourceManager }) => {
  // Warning: here is a fallback, so, there is no need to handle nullable value
  // This query is need here to show the files count in Folder preview
  const { data: files = [] } = useRMFieldFiles({ fieldId: field.id });
  const file = useMemo(() => files.find((file) => file.is_latest_version), [files]);
  const { data: references = [] } = useRMFieldFileReferences({ fileId: file?.id });

  const folders = useMemo(
    () => getFolders({ previousFilesCount: files.length, mappedElementsCount: references.length }),
    [references.length, files.length]
  );
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
          "MS Mapping": <MSMapping fieldId={field.id} resourceManager={resourceManager} />,
        }[selectedFolder.name]
      }
    </RMContextFeatureTemplate>
  );
};

RMContextFeatureDataView.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeatureDataView;
