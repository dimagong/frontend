import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { useStoreQuery } from "hooks/useStoreQuery";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectMasterSchemaHierarchy } from "app/selectors/masterSchemaSelectors";

import { TreeHierarchy, useTreeHierarchyExpandable, ADD_FIELD, ADD_GROUP } from "components/TreeHierarchy";

import MSEButton from "features/MasterSchema/share/mse-button";

import GeneralMSHTreeElement from "./GeneralMSHTreeElement";
import MasterSchemaHierarchySearch from "./MasterSchemaHierarchySearch";

const {
  getdFormsRequest,
  getMasterSchemaHierarchyRequest,
  addFieldToMasterSchemaRequest,
  addGroupToMasterSchemaRequest,
} = appSlice.actions;

const elementAdditionActionTypes = [addFieldToMasterSchemaRequest.type, addGroupToMasterSchemaRequest.type];

const initialSearch = { name: "", application_ids: [], date_begin: null, date_end: null };

const isSearchEmpty = (search) =>
  _.keys(search).every((key) => {
    const value = search[key];
    const expected = initialSearch[key];
    return _.isEqual(value, expected);
  });

const MasterSchemaHierarchy = ({ masterSchemaId, selectedNodes, onSelect, backgroundColor }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = React.useReducer((s, p) => ({ ...s, ...p }), initialSearch);
  const hierarchy = useStoreQuery(
    () => getMasterSchemaHierarchyRequest({ masterSchemaId, ...search }),
    selectMasterSchemaHierarchy(masterSchemaId),
    [masterSchemaId, search]
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
      <React.Profiler
        id="master-schema-hierarchy"
        onRender={(id, phase) => console.log(id, phase, { search, hierarchy })}
      >
        <Row className="position-relative">
          <Col>
            <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px", backgroundColor }}>
              <MasterSchemaHierarchySearch hierarchy={null} dForms={null} onSearch={setSearch} />
            </div>

            <div className="d-flex justify-content-center pt-4">
              <Spinner />
            </div>
          </Col>
        </Row>
      </React.Profiler>
    );
  }

  if (hierarchy.data) {
    return (
      <React.Profiler
        id="master-schema-hierarchy"
        onRender={(id, phase) => console.log(id, phase, { search, hierarchy })}
      >
        <Row className="position-relative">
          <Col>
            <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px", backgroundColor }}>
              <MasterSchemaHierarchySearch hierarchy={hierarchy.data} dForms={dForms.data} onSearch={setSearch} />

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
              components={{ Element: GeneralMSHTreeElement }}
            />
          </Col>
        </Row>
      </React.Profiler>
    );
  }

  return (
    <React.Profiler
      id="master-schema-hierarchy"
      onRender={(id, phase) => console.log(id, phase, { search, hierarchy })}
    >
      <Row className="position-relative">
        <Col>
          <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px", backgroundColor }}>
            <MasterSchemaHierarchySearch hierarchy={hierarchy.data} dForms={dForms.data} onSearch={setSearch} />
          </div>

          <h2 className="ms-nothing-was-found py-3">Nothing was found for your query</h2>
        </Col>
      </Row>
    </React.Profiler>
  );
};

MasterSchemaHierarchy.defaultProps = {
  backgroundColor: "#f8f8f8",
};

MasterSchemaHierarchy.propTypes = {
  masterSchemaId: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  backgroundColor: PropTypes.string,
};

export default MasterSchemaHierarchy;
