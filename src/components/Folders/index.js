import React from "react";
import classNames from "classnames";

import { Scrollbars } from "react-custom-scrollbars";
import { Spinner } from "reactstrap";

import "./styles.scss";

const defaultFolderKeySelector = (folder) => folder.id;
const defaultFolderItemsSelector = (folder) => folder.items;

const FolderTemplate = ({
  folderData,
  isSelected,
  onClick,
  folderItemsName,
  folderItemsSelector = defaultFolderItemsSelector,
}) => {
  const itemsName = folderItemsName || folderData.itemsName;

  return (
    <div className="folders-component__folder" onClick={onClick}>
      <div className={classNames("folders-component__folder_selection-state", { selected: isSelected })} />

      <div className="folders-component__folder_description">
        <div className="folders-component__folder_description_name">{folderData.name}</div>
        <div className="folders-component__folder_description_items-count">
          {`${folderItemsSelector(folderData).length} ${itemsName}${
            folderItemsSelector(folderData).length === 1 ? "" : "s"
          }`}
        </div>
      </div>
    </div>
  );
};

/*
 * folderItemsName - if provided, used for all folders that doesn't have
 *                   `folderItemsNameSelector` function or `folderItemsName` string in the root of `folderData`
 * omitLocalFolderNames - use this prop if you want to force `folderItemsName` be used for all folders
 * folderItemsSelector - select an array of items to get their length, you can place `itemsCount` into root of `folderData`
 *
 * */

const FoldersComponent = ({
  onFolderCreate,
  onFolderSelect,
  isLoading,
  folders,
  folderKeySelector = defaultFolderKeySelector,
  noFoldersMessage = "Create a folder to start creating questions",
  selectedFolder,
  folderItemsName,
}) => {
  return (
    <div className="folders-component">
      <Scrollbars
        className={"folder-scrollbar"}
        style={{ height: 170 }}
        renderScrollbarHorizontal={(props) => <div {...props} className="scrollbar-horizontal" />}
      >
        {!isLoading ? (
          folders &&
          folders.map((folder) => (
            <FolderTemplate
              key={folderKeySelector(folder)}
              onClick={() => onFolderSelect(folder)}
              folderData={folder}
              folderItemsName={folderItemsName}
              isSelected={folderKeySelector(folder) === folderKeySelector(selectedFolder)}
            />
          ))
        ) : (
          <div className="folders-component_loader">
            <Spinner color="primary" size={40} />
          </div>
        )}
        {!!onFolderCreate && (
          <button className="folders-component__add-folder" onClick={onFolderCreate}>
            +
          </button>
        )}
        {folders && !folders.length && <div className="folders-component__no-folders">{noFoldersMessage}</div>}
      </Scrollbars>
    </div>
  );
};

export default FoldersComponent;
