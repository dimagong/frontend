import React from 'react';

import {SearchOutlined} from "@material-ui/icons";

import Eye from './eye.png'
import Link from './link.png'

import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import Folders from "components/Folders";

import './styles.scss';
import {Scrollbars} from "react-custom-scrollbars";
import ListItem from "../../../home/ContextSearch/components/ListItem";
import {Col} from "reactstrap";

const RMContextFeatureComponent = () => {

  const dumbData = [
    {
      name: "PreviousVersions",
      id: 0,
      items: [1,2,3,4,5]
    },
    {
      name: "Shared with",
      id: 1,
      items: [1,2,3,4,5]
    },
  ];

  const dumbTable = [
    {user: "Test", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "Sarah"},
    {user: "Test", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "Sarah"},
    {user: "Test", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "Sarah"},
    {user: "Test", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "Sarah"},
    {user: "Test", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "Sarah"},
    {user: "Test", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "Sarah"},
    {user: "Test", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "Sarah"},
  ];

  return (
    <ContextFeatureTemplate contextFeatureTitle="File information">
      <div style={{fontSize: "20px", color:"#707070", marginTop: "-20px", marginBottom: "40px"}}>
        ValidPath / Contracts / AR Agreement.docx
      </div>
      <div>
        <Folders folders={dumbData} selectedFolder={dumbData[0]} folderItemsName={"user"} />
      </div>
      <div className="d-flex align-items-center">
        <div className="title">
          Parent File Version
        </div>

      </div>
      <div>


        <div className="list-header">
          <div>
            User
          </div>
          <div>
            Version
          </div>
          <div>
            Users
          </div>
          <div>
            Date
          </div>
          <div>
            Author
          </div>
        </div>

        <Scrollbars  autoHeight autoHeightMax={500}>
          <div className="items-list">
            {dumbTable.map((item, index) => (
              <div
                className={`list_item  selected`}
                key={`${item.user} ${index}`}
              >
                <div className="list_item_name">
                  {item.user}
                </div>
                <div className="list_item_description">
                  {item.version}
                </div>
                <div className="list_item_description">
                  {item.users}
                </div>
                <div className="list_item_description">
                  {item.date}
                </div>
                <div className="list_item_description">
                  {item.author}
                </div>

              </div>
            ))}
          </div>
        </Scrollbars>


      </div>

    </ContextFeatureTemplate>
  )
};

export default RMContextFeatureComponent;
