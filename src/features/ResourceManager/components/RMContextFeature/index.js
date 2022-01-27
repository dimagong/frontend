import React, { useState }from 'react';

import {SearchOutlined} from "@material-ui/icons";

import Eye from './eye.png'
import Link from './link.png'


import SharedWith from "./components/SharedWith";
import PreviousVersions from "./components/PreviousVersions";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import Folders from "components/Folders";

import './styles.scss';
import {Scrollbars} from "react-custom-scrollbars";
import ListItem from "../../../home/ContextSearch/components/ListItem";
import {Col} from "reactstrap";


const RMContextFeatureComponent = ({
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
      {/*<div style={{fontSize: "20px", color:"#707070", marginTop: "-20px", marginBottom: "40px"}}>*/}
      {/*  ValidPath / Contracts / AR Agreement.docx*/}
      {/*</div>*/}
      <div>
        <Folders onFolderSelect={handleFolderSelect} folders={dumbData} selectedFolder={selectedFolder}/>
      </div>

      <div>
        {selectedFolder.name === dumbData[0].name ? (
          <PreviousVersions
            onResourceUpload={onResourceUpload}
            previousVersions={connectionsAndVersions?.versions || []}
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
