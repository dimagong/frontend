import React, { useState }from 'react';

import SharedWith from "./components/SharedWith";
import PreviousVersionsCF from "./components/PreviousVersionsCF";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import Folders from "components/Folders";

import './styles.scss';

const RMContextFeatureComponent = ({
  selectableNodes,
  connectionsAndVersions,
  onResourceUpload,
}) => {

  const dumbData = [
    {
      name: "Previous Versions",
      id: 0,
      items: Array(connectionsAndVersions?.versions?.length || 0),
      itemsName: "revision",
    },
    {
      name: "Shared with",
      id: 1,
      items: [],
      itemsName: "user",
    },
  ];

  const [selectedFolder, setSelectedFolder] = useState(dumbData[0]);

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder)
  };

  return (
    <ContextFeatureTemplate contextFeatureTitle="File information">
      <div style={{fontSize: "20px", color:"#707070", marginTop: "-20px", marginBottom: "40px"}}>
        {connectionsAndVersions?.breadcrumbs?.join(" / ")}
      </div>
      <div>
        <Folders onFolderSelect={handleFolderSelect} folders={dumbData} selectedFolder={selectedFolder}/>
      </div>

      <div>
        {selectedFolder.name === dumbData[0].name ? (
          <PreviousVersionsCF
            versions={connectionsAndVersions?.versions || []}
            selectableNodes={selectableNodes}
            onResourceUpload={onResourceUpload}
          />
        ) : (
          <SharedWith
            connections={connectionsAndVersions?.master_schema_connections || []}
          />
        )}
      </div>
    </ContextFeatureTemplate>
  )
};

export default RMContextFeatureComponent;
