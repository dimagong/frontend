import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { ArrayOfStringType } from "utility/prop-types";

import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";
import { ADD_FIELD, ADD_GROUP, TreeHierarchy } from "components/TreeHierarchy";

import {
  useCreateMasterSchemaField,
  useCreateMasterSchemaGroup,
} from "api/masterSchema/hierarchy/masterSchemaHierarchyQueries";

import { useExpandableHierarchy } from "./hooks/useExpandableHierarchy";
import { isParamsEqualToInitial } from "./hooks/useHierarchyByUserSearch";

function UserMasterSchemaHierarchyData(props) {
  const { hierarchy, hierarchyParams, selectedIds, onSelect } = props;

  const createField = useCreateMasterSchemaField();
  const createGroup = useCreateMasterSchemaGroup();

  const onElementCreationSubmit = ({ type, ...creationData }) => {
    switch (type) {
      case ADD_FIELD:
        createField.mutate({ name: creationData.name, master_schema_group_id: creationData.parentId });
        break;
      case ADD_GROUP:
        createGroup.mutate({ name: creationData.name, parent_id: creationData.parentId });
        break;
      default:
        throw new Error("Unexpected element addition type.");
    }
  };

  const [{ expandedIds, isExpandedOnlyRoot }, { expandNode, expandAllNodes, collapseNode, collapseAllExceptRoot }] =
    useExpandableHierarchy(hierarchy);

  useEffect(() => {
    // Depend on hierarchy search params decide to collapse to root or expand whole hierarchy tree
    isParamsEqualToInitial(hierarchyParams) ? collapseAllExceptRoot() : expandAllNodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchyParams]);

  return (
    <>
      <div className="position-sticky zindex-1" style={{ top: "68px", left: "0px", paddingTop: "20px" }}>
        <div className="d-flex justify-content-end pb-1">
          <DeprecatedNmpButton
            className="p-0"
            textColor="currentColor"
            backgroundColor="transparent"
            disabled={isExpandedOnlyRoot}
            onClick={collapseAllExceptRoot}
          >
            Collapse
          </DeprecatedNmpButton>
        </div>
      </div>

      <TreeHierarchy
        hierarchy={hierarchy}
        expandedIds={expandedIds}
        onExpand={expandNode}
        onCollapse={collapseNode}
        selectedIds={selectedIds}
        onSelect={onSelect}
        elementCreationLoading={createField.isLoading || createGroup.isLoading}
        onElementCreationSubmit={onElementCreationSubmit}
      />
    </>
  );
}

UserMasterSchemaHierarchyData.propTypes = {
  hierarchy: PropTypes.object.isRequired,
  hierarchyParams: PropTypes.object.isRequired,
  selectedIds: ArrayOfStringType,
  onSelect: PropTypes.func.isRequired,
};

export default UserMasterSchemaHierarchyData;
