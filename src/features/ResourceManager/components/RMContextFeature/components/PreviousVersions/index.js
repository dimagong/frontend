import React from 'react';
import {Scrollbars} from "react-custom-scrollbars";
import ContextFeatureTemplate from "../../../../../../components/ContextFeatureTemplate";

const HEADERS = ["Action", "Version", "Users", "Date", "Author"];

const PreviousVersions = ({
  previousVersions,
}) => {
  const dumbTable2 = [
    {action: "Edited", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "John Doe"},
    {action: "Edited", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "John Doe"},
    {action: "Edited", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "John Doe"},
    {action: "Edited", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "John Doe"},
    {action: "Edited", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "John Doe"},
    {action: "Edited", version: "v2021.05.01", users: 2, date: "26/02/2021", author: "John Doe"},
  ];
  return (
    <div>
      <div className="d-flex align-items-center">
        <div className="title">
          Parent File Version
        </div>

      </div>
      <div>


        <div className="list-header">
          {HEADERS.map((header) => (
            <div>
              {header}
            </div>
          ))}
        </div>

        <Scrollbars  autoHeight autoHeightMax={500}>
          {!previousVersions?.length ? (
            <div className="d-flex justify-content-center pt-5 text-black-50 font-large-1">
              No versions found
            </div>
          ) : (
            <div className="items-list">
              {previousVersions.map((item, index) => (
                <div
                  className={`list_item  selected`}
                  key={` ${index}`}
                >
                  <div className="list_item_name">
                    {item.action}
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
          )}
        </Scrollbars>


      </div>
    </div>
  )
};

export default PreviousVersions;
