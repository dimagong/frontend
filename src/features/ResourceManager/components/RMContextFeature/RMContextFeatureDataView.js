import "./styles.scss";

import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";

import Folders from "components/Folders";

import MSMapping from "./components/MSMapping";
import FilesHistory from "./components/FilesHistory";
import RMContextFeatureTemplate from "./RMContextFeatureTemplate";

import { useRMFieldFiles } from "../../resourceManagerQueries";

let folderId = 0;
const getFolder = (name, count, itemsName) => ({ id: folderId++, name, items: Array(count), itemsName });
const getFolders = ({ previousFilesCount, mappedElementsCount }) => ({
  PreviousVersions: getFolder("Previous Versions", previousFilesCount, "revisions"),
  // SharedWith: getFolder("Shared With"),
  Mapping: getFolder("MS Mapping", mappedElementsCount, "mapped elements"),
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
          "Previous Versions": <FilesHistory fieldId={field.id} files={files} />,
          "MS Mapping": (
            <MSMapping
              document={{ id: 1, types: ["firstName", "lastName", "email", "number"] }}
              versions={[
                { name: "AR Agreement", version: "v2021.03.01 [26/02/2021]" },
                { name: "AR Agreement", version: "v2021.02.02 [24/01/2020]" },
                { name: "AR Agreement", version: "v2020.07.21 [22/02/2019]" },
              ]}
            />
          ),
        }[selectedFolder.name]
      }
    </RMContextFeatureTemplate>
  );
};

RMContextFeatureDataView.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeatureDataView;
