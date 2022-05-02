import React from "react";
import PropTypes from "prop-types";

import { ArrayOfString, IdType } from "utility/prop-types";

import NmpButton from "components/nmp/NmpButton";
import GeneralMSHTreeElement from "components/MasterSchemaHierarchy/GeneralMSHTreeElement";
import { ADD_FIELD, ADD_GROUP, TreeHierarchy, useTreeHierarchyExpandable } from "components/TreeHierarchy";

import RMContextTemplate from "./RMContextTemplate";

import { useCreateRMHierarchyField, useCreateRMHierarchyGroup } from "api/resourceManager/useRMHierarchies";

const stickyStyle = { top: "0px", left: "0px", backgroundColor: "#f8f8f8" };

const RMContextDataView = ({ resourceManagerId, hierarchy, selectedIds, onSelect }) => {
  const createField = useCreateRMHierarchyField({ resourceManagerId });
  const createGroup = useCreateRMHierarchyGroup({ resourceManagerId });

  const onElementCreationSubmit = ({ type, name, parentId }) => {
    switch (type) {
      case ADD_FIELD:
        createField.mutate({ name, resource_manager_directory_id: parentId });
        break;
      case ADD_GROUP:
        createGroup.mutate({ name, parent_id: parentId });
        break;
      default:
        throw new Error(`Unhandled type: [${type}] of hierarchy element creation.`);
    }
  };

  const expandable = useTreeHierarchyExpandable(hierarchy);

  return (
    <RMContextTemplate>
      <div className="position-sticky zindex-1" style={stickyStyle}>
        <div className="d-flex justify-content-end pb-1">
          <NmpButton
            className="p-0"
            textColor="currentColor"
            backgroundColor="transparent"
            disabled={!expandable.isDecedentsExpanded}
            onClick={expandable.expandOnlyRoot}
          >
            Collapse
          </NmpButton>
        </div>
      </div>

      <TreeHierarchy
        hierarchy={hierarchy}
        expandedIds={expandable.expandedIds}
        onExpand={expandable.expand}
        onCollapse={expandable.collapse}
        onSelect={onSelect}
        selectedIds={selectedIds}
        elementCreationLoading={createField.isLoading || createGroup.isLoading}
        onElementCreationSubmit={onElementCreationSubmit}
        components={{ Element: GeneralMSHTreeElement }}
      />
    </RMContextTemplate>
  );
};

RMContextDataView.propTypes = {
  resourceManagerId: IdType.isRequired,
  hierarchy: PropTypes.object.isRequired,
  selectedIds: ArrayOfString.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default RMContextDataView;
