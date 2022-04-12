import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import {Col, Row, Spinner} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";

import NmpButton from "components/nmp/NmpButton";
import {ADD_FIELD, ADD_GROUP, TreeHierarchy, useTreeHierarchyExpandable} from "components/TreeHierarchy";

import appSlice from "app/slices/appSlice";
import {
  selectUserMasterSchemaHierarchySearchParams,
  selectIsUserMasterSchemaHierarchySearchParamsInitial,
} from "app/selectors/userSelectors";

import UserMasterSchemaHierarchySearch from "./UserMasterSchemaHierarchySearch";
import {useMSAddField} from "./hooks/useMSAddField";
import {useMSAddGroup} from "./hooks/useMSAddGroup";
import {MSHierarchySearchKey, useMSHierarchySearch} from "./hooks/useMSHierarchySearch";
import {queryClient} from "api/queryClient";

const {
  setUserMasterSchemaHierarchySearchParams,
} = appSlice.actions;

const stickySearchStyles = {top: "0px", left: "0px", backgroundColor: "#fff"};

const UserMasterSchemaHierarchy = ({userId, hierarchyName, selectedNodes, onSelect}) => {
  const dispatch = useDispatch();

  const searchParams = useSelector(selectUserMasterSchemaHierarchySearchParams);
  const isSearchParamsInitial = useSelector(selectIsUserMasterSchemaHierarchySearchParamsInitial);
  const setSearchParams = React.useCallback(
    (newSearchParams) => dispatch(setUserMasterSchemaHierarchySearchParams({...searchParams, ...newSearchParams})),
    [dispatch, searchParams]
  );

  const hierarchy = useMSHierarchySearch({
    userId,
    ...searchParams,
    show_empty_folders: isSearchParamsInitial
  }, {});

  const onEditingHierarchy = () => {
    return {
      onSuccess: () => {
        queryClient.invalidateQueries([MSHierarchySearchKey, {
          userId, ...searchParams,
          show_empty_folders: isSearchParamsInitial
        }])
      }
    }
  }

  const addFieldToMS = useMSAddField(userId, onEditingHierarchy())
  const addGroupToMS = useMSAddGroup(userId, onEditingHierarchy())


  const expandable = useTreeHierarchyExpandable(hierarchy.data);
  const selectedIds = React.useMemo(() => selectedNodes.map(_.get("nodeId")), [selectedNodes]);

  const onElementCreationSubmit = ({type, ...creationData}) => {
    switch (type) {
      case ADD_FIELD:
        addFieldToMS.mutate(creationData);
        break;
      case ADD_GROUP:
        addGroupToMS.mutate(creationData);
        break;
      default:
        throw new Error("Unexpected element addition type.");
    }
  };

  React.useEffect(() => {
    if (!hierarchy.data || hierarchy.isLoading) return;
    isSearchParamsInitial ? expandable.expandOnlyRoot() : expandable.expandAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchParamsInitial]);

  if (hierarchy.isLoading) {
    return (
      <Row className="position-relative">
        <Col>
          <div className="position-sticky zindex-1 pt-2" style={stickySearchStyles}>
            <UserMasterSchemaHierarchySearch hierarchyName={hierarchyName} onSearch={setSearchParams}/>
          </div>

          <div className="d-flex justify-content-center pt-4">
            <Spinner/>
          </div>
        </Col>
      </Row>
    );
  }

  if (hierarchy.data) {
    return (
      <Row className="position-relative">
        <Col>
          <div className="position-sticky zindex-1 pt-2" style={stickySearchStyles}>
            <UserMasterSchemaHierarchySearch
              hierarchy={hierarchy.data}
              hierarchyName={hierarchyName}
              onSearch={setSearchParams}
            />

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
            hierarchy={hierarchy.data}
            expandedIds={expandable.expandedIds}
            onExpand={expandable.expand}
            onCollapse={expandable.collapse}
            selectedIds={selectedIds}
            onSelect={onSelect}
            elementCreationLoading={addFieldToMS.isLoading || addGroupToMS.isLoading}
            onElementCreationSubmit={onElementCreationSubmit}
          />
        </Col>
      </Row>
    );
  }

  return (
    <Row className="position-relative">
      <Col>
        <div className="position-sticky zindex-1 pt-2" style={stickySearchStyles}>
          <UserMasterSchemaHierarchySearch hierarchyName={hierarchyName} onSearch={setSearchParams}/>
        </div>

        <h2 className="ms-nothing-was-found py-3">Nothing was found for your query</h2>
      </Col>
    </Row>
  );
};

UserMasterSchemaHierarchy.propTypes = {
  userId: PropTypes.number.isRequired,
  hierarchyName: PropTypes.string.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UserMasterSchemaHierarchy;
