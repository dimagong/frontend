import React, { useState }from 'react';

import SharedWith from "./components/SharedWith";
import PreviousVersions from "./components/PreviousVersions";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import Folders from "components/Folders";

import './styles.scss';
import MSMapping from "./components/MSMapping";

const RMContextFeatureComponent = ({
  connectionsAndVersions,
  onResourceUpload,
  onTemplateDownload,
  onTemplateRemove,
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
    {
      name: "MS Mapping",
      id: 2,
      items: [],
      itemsName: "version",
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
        {selectedFolder.name === dumbData[0].name && (
          <PreviousVersions
            onResourceUpload={onResourceUpload}
            previousVersions={connectionsAndVersions?.versions || []}
            onTemplateDownload={onTemplateDownload}
            onTemplateRemove={onTemplateRemove}
          />
        )}

        {selectedFolder.name === dumbData[1].name && (
          <SharedWith
            connections={connectionsAndVersions?.master_schema_connections || []}
          />
        )}

        {selectedFolder.name === dumbData[2].name && (
          <MSMapping
            document={{id: 1, types: ['firstName', 'lastName', 'email', 'number']}}
            versions={[{name: 'AR Agreement', 'version': 'v2021.03.01 [26/02/2021]'}, {name: 'AR Agreement', 'version': 'v2021.02.02 [24/01/2020]'}, {name: 'AR Agreement', 'version': 'v2020.07.21 [22/02/2019]'}]}
          />
        )}
      </div>



    </ContextFeatureTemplate>
  )
};

export default RMContextFeatureComponent;
