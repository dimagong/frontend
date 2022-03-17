import "./styles.scss";

import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import { useQuery } from "react-query";
import React, { useMemo, useState } from "react";

import Folders from "components/Folders";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import { resourceManagerService } from "api/resourceManager";

import PreviousVersionsCF from "./components/PreviousVersionsCF";

const RMContextFeature = ({ field }) => {
  const { data: versions, isLoading } = useQuery(
    ["resource-manager-field-versions", field.id],
    () => resourceManagerService.getVersions({ fieldId: field.id }),
    {
      select: ({ versions }) => versions,
    }
  );

  const folders = useMemo(
    () => ({
      previousVersions: {
        id: 0,
        name: "Previous Versions",
        items: Array(versions?.length || 0),
        itemsName: "revision",
      },
    }),
    [versions]
  );
  const foldersAsArray = useMemo(() => Object.values(folders), [folders]);
  const [selectedFolder, setSelectedFolder] = useState(folders.previousVersions);

  const handleFolderSelect = (folder) => setSelectedFolder(folder);

  if (isLoading) {
    return (
      <ContextFeatureTemplate contextFeatureTitle="File information">
        <div className="d-flex justify-content-center pt-5">
          <Spinner color="primary" size="lg" />
        </div>
      </ContextFeatureTemplate>
    );
  }

  return (
    <ContextFeatureTemplate contextFeatureTitle="File information">
      <strong className="font-size-large" style={{ color: "#707070" }}>
        {field.path.join("/")}
      </strong>

      <div className="mt-3">
        <Folders onFolderSelect={handleFolderSelect} folders={foldersAsArray} selectedFolder={selectedFolder} />
      </div>

      <div>
        {selectedFolder.id === folders.previousVersions.id ? (
          <PreviousVersionsCF field={field} versions={versions} />
        ) : null}
      </div>
    </ContextFeatureTemplate>
  );
};

RMContextFeature.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeature;
