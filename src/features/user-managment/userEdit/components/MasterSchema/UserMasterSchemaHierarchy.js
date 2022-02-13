import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { useStoreQuery } from "hooks/useStoreQuery";
import { ADD_FIELD, ADD_GROUP, TreeHierarchy, useTreeHierarchyExpandable } from "components/TreeHierarchy";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectUserMasterSchemaHierarchy } from "app/selectors/userSelectors";

import MSEButton from "features/MasterSchema/share/mse-button";

import UserMasterSchemaHierarchySearch from "./UserMasterSchemaHierarchySearch";

const {
  getdFormsRequest,
  getUserMasterSchemaHierarchyRequest,
  addFieldToMasterSchemaRequest,
  addGroupToMasterSchemaRequest,
} = appSlice.actions;

const elementAdditionActionTypes = [addFieldToMasterSchemaRequest.type, addGroupToMasterSchemaRequest.type];

const initialSearch = {
  name: "",
  application_ids: [],
  only_files: false,
  date_begin: null,
  date_end: null,
  show_empty_folders: false,
};

const isSearchEmpty = (search) =>
  _.keys(search).every((key) => {
    const value = search[key];
    const expected = initialSearch[key];
    return _.isEqual(value, expected);
  });

const UserMasterSchemaHierarchy = ({ userId, selectedNodes, onSelect }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = React.useReducer((s, p) => ({ ...s, ...p }), initialSearch);
  const hierarchy = useStoreQuery(
    () =>
      getUserMasterSchemaHierarchyRequest({
        userId,
        ...(search === initialSearch ? { show_empty_folders: true } : search),
      }),
    selectUserMasterSchemaHierarchy,
    [userId, search]
  );
  const dForms = useStoreQuery(() => getdFormsRequest(), selectdForms);

  const expandable = useTreeHierarchyExpandable(hierarchy.data);
  const selectedIds = React.useMemo(() => selectedNodes.map(_.get("nodeId")), [selectedNodes]);

  const elementCreationLoading = useSelector(createLoadingSelector(elementAdditionActionTypes, true));

  const onElementCreationSubmit = ({ type, ...creationData }) => {
    switch (type) {
      case ADD_FIELD:
        dispatch(addFieldToMasterSchemaRequest(creationData));
        break;
      case ADD_GROUP:
        dispatch(addGroupToMasterSchemaRequest(creationData));
        break;
      default:
        throw new Error("Unexpected element addition type.");
    }
  };

  React.useEffect(() => {
    if (!hierarchy.data || hierarchy.isLoading) return;
    isSearchEmpty(search) ? expandable.expandOnlyRoot() : expandable.expandAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy.data]);

  if (hierarchy.isLoading || dForms.isLoading) {
    return (
      <Row className="position-relative">
        <Col>
          <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px" }}>
            <UserMasterSchemaHierarchySearch hierarchy={null} dForms={null} onSearch={setSearch} />
          </div>

          <div className="d-flex justify-content-center pt-4">
            <Spinner />
          </div>
        </Col>
      </Row>
    );
  }

  if (hierarchy.data) {
    return (
      <Row className="position-relative">
        <Col>
          <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px" }}>
            <UserMasterSchemaHierarchySearch hierarchy={hierarchy.data} dForms={dForms.data} onSearch={setSearch} />

            <div className="d-flex justify-content-end pb-1">
              <MSEButton
                className="p-0"
                textColor="currentColor"
                backgroundColor="transparent"
                disabled={!expandable.isDecedentsExpanded}
                onClick={expandable.expandOnlyRoot}
              >
                Collapse
              </MSEButton>
            </div>
          </div>

          <TreeHierarchy
            hierarchy={hierarchy.data}
            expandedIds={expandable.expandedIds}
            onExpand={expandable.expand}
            onCollapse={expandable.collapse}
            selectedIds={selectedIds}
            onSelect={onSelect}
            elementCreationLoading={elementCreationLoading}
            onElementCreationSubmit={onElementCreationSubmit}
          />
        </Col>
      </Row>
    );
  }

  return (
    <Row className="position-relative">
      <Col>
        <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px" }}>
          <UserMasterSchemaHierarchySearch hierarchy={hierarchy.data} dForms={dForms.data} onSearch={setSearch} />
        </div>

        <h2 className="ms-nothing-was-found py-3">Nothing was found for your query</h2>
      </Col>
    </Row>
  );
};

UserMasterSchemaHierarchy.propTypes = {
  userId: PropTypes.number.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UserMasterSchemaHierarchy;
