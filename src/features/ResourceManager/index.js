import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import RMContextComponent from "./components/RMContext";
import RMContextFeatureComponent from "./components/RMContextFeature";
import instance from "api";
import { downloadBlob } from "services/files.service";

import {
  selectSelectedResourceManager,
  selectResourceManagerHierarchy,
  selectResourceManagerConnectionsAndVersions,
} from "app/selectors/resourceManagerSelector";
import {useTreeHierarchyExpandable, useTreeHierarchySelectable} from "components/TreeHierarchy";
import { usePrevious } from "hooks/common";
import appSlice from "../../app/slices/appSlice";

import { createLoadingSelector } from "app/selectors/loadingSelector";

import { ADD_FIELD, ADD_GROUP } from "components/TreeHierarchy";

const {
  getResourceManagerHierarchyRequest,
  createResourceManagerFieldRequest,
  createResourceManagerGroupRequest,
  getResourcePreviousVersionsRequest,
  uploadResourceRequest,
  removeResourceTemplateRequest,
} = appSlice.actions;

const createResourceManagerElementTypes = [
  createResourceManagerFieldRequest.type,
  createResourceManagerGroupRequest.type
];

const ResourceManager = () => {
  const dispatch = useDispatch();

  const selectedResourceManager = useSelector(selectSelectedResourceManager);
  const hierarchy = useSelector(selectResourceManagerHierarchy);
  const resourceConnectionsAndVersions = useSelector(selectResourceManagerConnectionsAndVersions);
  const isHierarchyLoading = useSelector(createLoadingSelector([getResourceManagerHierarchyRequest.type]));
  const isResourceManagerElementCreationLoading = useSelector(createLoadingSelector(createResourceManagerElementTypes, true));

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

  const onElementCreationSubmit = ({ type, name, parentId }) => {
    switch (type) {
      case ADD_FIELD:
        dispatch(createResourceManagerFieldRequest({name, resource_manager_directory_id: parentId, provided_by: selectedResourceManager.id}));
        break;
      case ADD_GROUP:
        dispatch(createResourceManagerGroupRequest({name, parent_id: parentId, resource_manager_id: selectedResourceManager.id}))
        break;
      default: throw new Error(`Unhandled type: [${type}] of hierarchy element creation.`);
    }
  };

  const handleResourceUpload = (resource) => {
    const dataToSubmit = new FormData();

    dataToSubmit.append("file", resource);
    dataToSubmit.append("field_id", selectableNodes.selected.field.id);

    dispatch(uploadResourceRequest(dataToSubmit))
  };

  const handleResourceTemplateDownload = (id, name) => {
    // This request doesn't written in normal way, cause it got no
    // data to store in redux and also needs a different responseType
    instance({
      url: `api/resource-manager-field-file/${id}/download`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      downloadBlob(response.data, name)
    });
  };

  const handleResourceTemplateRemove = (id) => {
    dispatch(removeResourceTemplateRequest({fileId: id, resourceManagerFieldId: selectableNodes.selected.node.id}))
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
        isElementCreationLoading={isResourceManagerElementCreationLoading}
        onElementCreationSubmit={onElementCreationSubmit}
      />
      {!!selectableNodes?.keys?.length && (
        <RMContextFeatureComponent
          onResourceUpload={handleResourceUpload}
          connectionsAndVersions={resourceConnectionsAndVersions}
          onTemplateDownload={handleResourceTemplateDownload}
          onTemplateRemove={handleResourceTemplateRemove}
        />
      )}
    </div>
  )
};

export default ResourceManager;
