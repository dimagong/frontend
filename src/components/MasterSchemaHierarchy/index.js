import "./styles.scss";

import _ from "lodash";
import { Col, Row, Spinner } from "reactstrap";
import PropTypes from "prop-types";
import { get, isEmpty } from "lodash/fp";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectMasterSchemaHierarchy } from "app/selectors/masterSchemaSelectors";

import MSEButton from "features/MasterSchema/share/mse-button";

import { useDidMount } from "hooks/use-did-mount";
import { useStoreQuery } from "hooks/useStoreQuery";

import SearchAndFilter from "components/SearchAndFilter";
import { TreeHierarchy, useTreeHierarchyExpandable, ADD_FIELD, ADD_GROUP } from "components/TreeHierarchy";

import GeneralMSHTreeElement from "./GeneralMSHTreeElement";

const {
  getdFormsRequest,
  getMasterSchemaHierarchyRequest,
  addFieldToMasterSchemaRequest,
  addGroupToMasterSchemaRequest,
} = appSlice.actions;

const elementAdditionActionTypes = [addFieldToMasterSchemaRequest.type, addGroupToMasterSchemaRequest.type];

const initialSearch = { name: "", application_ids: [], date_begin: null, date_end: null };

const MasterSchemaHierarchy = ({ masterSchemaId, selectedNodes, onSelect, backgroundColor }) => {
  const dispatch = useDispatch();

  const allDForms = useStoreQuery(() => getdFormsRequest(), selectdForms);

  const [search, setSearch] = React.useReducer((s, p) => ({ ...s, ...p }), initialSearch);

  const hierarchy = useStoreQuery(
    () => getMasterSchemaHierarchyRequest({ masterSchemaId, ...search }),
    selectMasterSchemaHierarchy(masterSchemaId),
    [masterSchemaId, search]
  );

  const expandable = useTreeHierarchyExpandable(hierarchy.data);
  const selectedIds = React.useMemo(() => selectedNodes.map(get("nodeId")), [selectedNodes]);

  const [filterTypes, setFilterTypes] = useState([]);
  const filterNames = useMemo(() => filterTypes.map(get("name")), [filterTypes]);

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

  const onSearchSubmit = (searchName) => {
    const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;

    setSearch({ name: searchValue });
  };

  const onFilterSubmit = (filter, filterHierarchy) => {
    if (!filterHierarchy) return;

    const filters = _.intersectionBy(
      allDForms.filter((item) => item.groups.filter((group) => group.name === filterHierarchy.name).length > 0),
      filter.selectedFilters
        .find((item) => item.name === "applications")
        .selected.map((item) => {
          return { name: item };
        }),
      "name"
    ).map((item) => item.id);

    setSearch({ application_ids: filters });
  };

  const getDateFormat = (date) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    if (date?.length > 1) {
      return date.map((item) => item.toLocaleString("en-CA", options));
    } else {
      return [undefined, undefined];
    }
  };

  const onCalendarChange = (date) => {
    const formattedDate = getDateFormat(date);

    setSearch({ ...search, dates: formattedDate });
  };

  const isSearchEmpty = React.useCallback(
    () => isEmpty(search.name) && isEmpty(search.application_ids) && !search.date_begin && !search.date_begin,
    [search.application_ids, search.date_begin, search.name]
  );

  useDidMount(() => {
    if (hierarchy.data?.name) {
      setFilterTypes(
        allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.data.name).length > 0)
      );
    }
  });

  React.useEffect(() => {
    if (!hierarchy.data || hierarchy.isLoading) return;
    isSearchEmpty() ? expandable.expandOnlyRoot() : expandable.expandAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy.data]);

  if (hierarchy.isLoading) {
    return (
      <Row className="position-relative">
        <Col>
          <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px", backgroundColor }}>
            <SearchAndFilter
              placeholder=""
              handleSearch={onSearchSubmit}
              filterTypes={{ applications: filterNames }}
              applyFilter={onFilterSubmit}
              onCalendarChange={onCalendarChange}
              isCalendar
              hasIcon
              filterTabPosition={"left"}
              dataToFilter={hierarchy.data}
            />
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
          <div className="position-sticky zindex-1" style={{ top: "0px", left: "0px", backgroundColor }}>
            <SearchAndFilter
              placeholder=""
              handleSearch={onSearchSubmit}
              filterTypes={{ applications: filterNames }}
              applyFilter={onFilterSubmit}
              onCalendarChange={onCalendarChange}
              isCalendar
              hasIcon
              filterTabPosition={"left"}
              dataToFilter={hierarchy.data}
            />

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
    );
  }

  return (
    <Row>
      <Col>
        <div style={{ backgroundColor }}>
          <SearchAndFilter
            placeholder=""
            handleSearch={onSearchSubmit}
            filterTypes={{ applications: filterNames }}
            applyFilter={onFilterSubmit}
            onCalendarChange={onCalendarChange}
            isCalendar
            hasIcon
            filterTabPosition={"left"}
            dataToFilter={hierarchy.data}
          />
        </div>

        <h2 className="ms-nothing-was-found">Nothing was found for your query</h2>
      </Col>
    </Row>
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
