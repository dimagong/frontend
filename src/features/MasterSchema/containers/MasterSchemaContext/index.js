import "./styles.scss";

import _ from "lodash";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import React, { useMemo, useRef, useState } from "react";
import { __, get, isEmpty, filter, negate, includes } from "lodash/fp";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MSEButton from "features/MasterSchema/share/mse-button";

import { useDidMount } from "hooks/use-did-mount";
import { useDidUpdate } from "hooks/use-did-update";
import { useToggleable } from "hooks/use-toggleable";

import SearchAndFilter from "components/SearchAndFilter";
import ContextTemplate from "components/ContextTemplate";

import MasterSchemaHierarchy from "./components/MasterSchemaHierarchy";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const {
  getMasterSchemaHierarchyRequest,
  getdFormsRequest,
  setMasterSchemaSearch,
  setUnapprovedMasterSchemaRequest,
  approveUnapprovedFieldsRequest,
} = appSlice.actions;

// ToDo: write test for this
// fixme: sometimes hierarchy is collapsed
export const useMasterSchemaExpandable = (hierarchy) => {
  const initialKeys = hierarchy ? [hierarchy.nodeId] : [];
  const toggleable = useToggleable(initialKeys);

  const isInitial = useMemo(
    () => toggleable.keys.length === 0 || (toggleable.keys.length === 1 && toggleable.keys[0] === hierarchy?.nodeId),
    [hierarchy, toggleable.keys]
  );

  const setInitialKeys = () => toggleable.setKeys(initialKeys);

  const expand = (node) => toggleable.setKeys((prev) => [...prev, node.nodeId]);

  const collapse = (node) =>
    toggleable.setKeys((prev) => {
      const nodeIds = [];

      const recursive = (groupIds = node.groups) => {
        nodeIds.push(...groupIds);
        const groups = groupIds.map((id) => hierarchy.nodeMap.get(id));
        groups.forEach((group) => recursive(group.groups));
      };
      recursive(node.groups);

      nodeIds.push(node.nodeId);

      return filter(negate(includes(__, nodeIds)))(prev);
    });

  const expandAll = () => toggleable.setKeys([...hierarchy.nodeMap.keys()]);

  return [
    {
      isInitial,
      expandedIds: toggleable.keys,
    },
    {
      toggle: toggleable.toggle,
      setKeys: toggleable.setKeys,
      setInitialKeys,
      expand,
      collapse,
      expandAll,
    },
  ];
};

const MasterSchemaContext = ({ hierarchy, selectedIds, unapproved, onSelect }) => {
  const dispatch = useDispatch();
  const allDForms = useSelector(selectdForms);
  const search = useSelector(masterSchemaSelectors.selectSearch);
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const isApprovingLoading = useSelector(createLoadingSelector([approveUnapprovedFieldsRequest.type], false));

  const [expandableState, expandable] = useMasterSchemaExpandable(hierarchy);

  const isSearchingRef = useRef(false);
  const [filterTypes, setFilterTypes] = useState([]);
  const filterNames = useMemo(() => filterTypes.map(get("name")), [filterTypes]);

  const onSearchSubmit = (searchName) => {
    const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;
    dispatch(setMasterSchemaSearch({ ...search, value: searchValue }));
  };

  const onFilterSubmit = (filterOptions, filter) => {
    if (!hierarchy) return;

    const filters = _.intersectionBy(
      allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0),
      filter.applications.map((item) => {
        return { name: item };
      }),
      "name"
    ).map((item) => item.id);

    dispatch(setMasterSchemaSearch({ ...search, filters }));
  };

  const onFilterCancel = () => dispatch(setMasterSchemaSearch({ ...search, filters: [] }));

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

    dispatch(setMasterSchemaSearch({ ...search, dates: formattedDate }));
  };

  useDidMount(() => {
    dispatch(getdFormsRequest());

    if (hierarchy?.name) {
      setFilterTypes(
        allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0)
      );
    }
  });

  useDidUpdate(() => (isSearchingRef.current = true), [search]);

  useDidUpdate(() => {
    if (isSearchingRef.current && hierarchy) {
      isSearchingRef.current = false;
      isEmpty(search.value) ? expandable.setInitialKeys() : expandable.expandAll();
    }
  }, [hierarchy]);

  useDidUpdate(() => void dispatch(getMasterSchemaHierarchyRequest({ id: selectedId })), [search]);

  useDidUpdate(() => {
    if (!isApprovingLoading) {
      dispatch(setUnapprovedMasterSchemaRequest({ id: hierarchy.masterSchemaId }));
      dispatch(getMasterSchemaHierarchyRequest({ id: hierarchy.masterSchemaId }));
    }
  }, [isApprovingLoading]);

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      <div className="position-relative">
        {!isEmpty(unapproved) && <UnapprovedFieldsComponent fields={unapproved} />}

        <div
          className={hierarchy ? "position-sticky zindex-1" : ""}
          style={{ top: "0px", left: "0px", backgroundColor: "#f8f8f8" }}
        >
          <SearchAndFilter
            className="ms-search-and-filter"
            placeholder=""
            handleSearch={onSearchSubmit}
            onCancelFilter={onFilterCancel}
            filterTypes={{ applications: filterNames }}
            applyFilter={onFilterSubmit}
            onCalendarChange={onCalendarChange}
            isCalendar
            hasIcon
            filterTabPosition={"left"}
          />

          {hierarchy && (
            <div className="d-flex justify-content-end pb-1">
              <MSEButton
                className="p-0"
                textColor="currentColor"
                backgroundColor="transparent"
                disabled={expandableState.isInitial}
                onClick={expandable.setInitialKeys}
              >
                Collapse
              </MSEButton>
            </div>
          )}
        </div>

        {hierarchy ? (
          <MasterSchemaHierarchy
            hierarchy={hierarchy}
            expandedIds={expandableState.expandedIds}
            onExpand={expandable.expand}
            onCollapse={expandable.collapse}
            selectedIds={selectedIds}
            onSelect={onSelect}
            key={hierarchy.name}
          />
        ) : (
          <h2 className="ms-nothing-was-found">Nothing was found for your query</h2>
        )}
      </div>
    </ContextTemplate>
  );
};

MasterSchemaContext.defaultProps = {
  unapproved: [],
};

MasterSchemaContext.propTypes = {
  hierarchy: PropTypes.object,
  unapproved: PropTypes.array,

  onSelect: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};

export default MasterSchemaContext;
