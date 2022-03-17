import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";

import NmpButton from "components/nmp/NmpButton";
import ContextTemplate from "components/ContextTemplate";
import { ADD_FIELD, ADD_GROUP, TreeHierarchy, useTreeHierarchyExpandable } from "components/TreeHierarchy";

import { resourceManagerService } from "api/resourceManager";

const stickyStyle = { top: "0px", left: "0px", backgroundColor: "#f8f8f8" };

const RMContext = ({ resourceManagerId, selectedIds, onSelect }) => {
  const queryClient = useQueryClient();

  const { data: hierarchy, isLoading } = useQuery(
    ["resource-manager-hierarchy", resourceManagerId],
    () => resourceManagerService.getHierarchy({ resourceManagerId }),
    {
      onSuccess: (_hierarchy) => expandable.expand(_hierarchy),
    }
  );

  const createField = useMutation((newField) => resourceManagerService.createField(newField), {
    onSuccess: () => queryClient.invalidateQueries(["resource-manager-hierarchy", resourceManagerId]),
  });

  const createGroup = useMutation((newGroup) => resourceManagerService.createGroup(newGroup), {
    onSuccess: () => queryClient.invalidateQueries(["resource-manager-hierarchy", resourceManagerId]),
  });

  const onElementCreationSubmit = ({ type, name, parentId }) => {
    switch (type) {
      case ADD_FIELD:
        createField.mutate({ name, parentId, resourceManagerId, });
        break;
      case ADD_GROUP:
        createGroup.mutate({ name, parentId, resourceManagerId });
        break;
      default:
        throw new Error(`Unhandled type: [${type}] of hierarchy element creation.`);
    }
  };

  const expandable = useTreeHierarchyExpandable(hierarchy);

  if (isLoading) {
    return (
      <ContextTemplate contextTitle="Resource Manager">
        <div className="d-flex justify-content-center pt-5">
          <Spinner color="primary" size="lg" />
        </div>
      </ContextTemplate>
    );
  }

  if (hierarchy == null) {
    return (
      <ContextTemplate contextTitle="Resource Manager">
        <string>There is no resources</string>
      </ContextTemplate>
    );
  }

  return (
    <ContextTemplate contextTitle="Resource Manager">
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
      />
    </ContextTemplate>
  );
};

const IdType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

RMContext.propTypes = {
  selectedIds: PropTypes.arrayOf(IdType).isRequired,
  onSelect: PropTypes.func.isRequired,

  resourceManagerId: IdType.isRequired,
};

export default RMContext;
