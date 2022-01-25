import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import RMContextComponent from "./components/RMContext";
import RMContextFeatureComponent from "./components/RMContextFeature";

import {
  selectSelectedResourceManager,
  selectResourceManagerHierarchy,
  selectResourceManagerConnectionsAndVersions,
} from "app/selectors/resourceManagerSelector";
import {useTreeHierarchyExpandable, useTreeHierarchySelectable} from "components/TreeHierarchy";
import { usePrevious } from "hooks/common";
import appSlice from "../../app/slices/appSlice";

import { createLoadingSelector } from "app/selectors/loadingSelector";

const {
  getResourceManagerHierarchyRequest,
  createResourceManagerFieldRequest,
  createResourceManagerGroupRequest,
  getResourcePreviousVersionsRequest,
  uploadResourceRequest,
} = appSlice.actions;

const ResourceManager = () => {
  const dispatch = useDispatch();

  const selectedResourceManager = useSelector(selectSelectedResourceManager);
  const hierarchy = useSelector(selectResourceManagerHierarchy);
  const resourceConnectionsAndVersions = useSelector(selectResourceManagerConnectionsAndVersions);
  const isHierarchyLoading = useSelector(createLoadingSelector([getResourceManagerHierarchyRequest.type]));

  const hierarchyPrevious = usePrevious(hierarchy);

  const expandable = useTreeHierarchyExpandable(hierarchy);
  const selectableNodes = useTreeHierarchySelectable(hierarchy);

  const handleSelect = (node) => {
    // Do not select groups (directories), expand them instead for now
    if (!selectableNodes.getGroups([node]).length) {
      // if element is not selected, deselect all elements and select the one that user clicked on
      if (!expandable.expandedIds.includes(node.nodeId)) {
        selectableNodes.clear();
        selectableNodes.toggle(node.nodeId);

        dispatch(getResourcePreviousVersionsRequest(node.id))
      }
    } else {
      if (expandable.expandedIds.includes(node.nodeId)) {
        expandable.collapse(node);
      } else {
        expandable.expand(node);
      }
    }
  };

  const handleResourceManagerFieldCreate = ({ name, parentId }) => {
    dispatch(createResourceManagerFieldRequest({name, resource_manager_directory_id: parentId, provided_by: selectedResourceManager.id}))
  };

  const handleResourceManagerGroupCreate = ({ name, parentId }) => {
    dispatch(createResourceManagerGroupRequest({name, parent_id: parentId, resource_manager_id: selectedResourceManager.id}))
  };

  const handleResourceUpload = (resource) => {
    console.log("submitted", resource);

    const dataToSubmit = new FormData();

    dataToSubmit.append("file", resource);
    dataToSubmit.append("field_id", selectableNodes.selected.field.id);

    dispatch(uploadResourceRequest(dataToSubmit))
  };

  useEffect(() => {
    selectableNodes.clear();
    dispatch(getResourceManagerHierarchyRequest(selectedResourceManager.id))
  }, [selectedResourceManager]);

  useEffect(() => {
    if (hierarchyPrevious?.length === 0) {
      expandable.expandOnlyRoot()
    }
  }, [hierarchy]);

  return (
    <div className="d-flex">
      <RMContextComponent
        hierarchy={hierarchy}
        onSelect={handleSelect}
        selectedNodes={selectableNodes.keys}
        isLoading={isHierarchyLoading}
        expandable={expandable}
        onFieldCreate={handleResourceManagerFieldCreate}
        onGroupCreate={handleResourceManagerGroupCreate}
      />
      {!!selectableNodes?.keys?.length && (
        <RMContextFeatureComponent
          onResourceUpload={handleResourceUpload}
          connectionsAndVersions={resourceConnectionsAndVersions}
        />
      )}
    </div>
  )
};

export default ResourceManager;
