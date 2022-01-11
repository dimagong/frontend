import "./styles.scss";

import _ from "lodash";
import PropTypes from "prop-types";
import { get, isEmpty } from "lodash/fp";
import { useDispatch, useSelector } from "react-redux";
import React, { useMemo, useRef, useState } from "react";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MSEButton from "features/MasterSchema/share/mse-button";


import { useDidMount } from "hooks/use-did-mount";
import { useDidUpdate } from "hooks/use-did-update";

import SearchAndFilter from "components/SearchAndFilter";
import TreeHierarchy, { useTreeHierarchyExpandable } from "components/TreeHierarchy";

const { getMasterSchemaHierarchyRequest, getdFormsRequest, setMasterSchemaSearch } = appSlice.actions;

const MasterSchemaHierarchy = ({ hierarchy, selectedIds, onSelect }) => {
  const dispatch = useDispatch();
  const allDForms = useSelector(selectdForms);
  const search = useSelector(masterSchemaSelectors.selectSearch);
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);

  const [expandableState, expandable] = useTreeHierarchyExpandable(hierarchy);

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
      isEmpty(search.value) ? expandable.expandOnlyRoot() : expandable.expandAll();
    }
  }, [hierarchy]);

  useDidUpdate(() => void dispatch(getMasterSchemaHierarchyRequest({ id: selectedId })), [search]);

  return (
    <div className="position-relative">
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
              disabled={!expandableState.isDecedentsExpanded}
              onClick={expandable.expandOnlyRoot}
            >
              Collapse
            </MSEButton>
          </div>
        )}
      </div>

      {hierarchy ? (
        <TreeHierarchy
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
  );
};

MasterSchemaHierarchy.propTypes = {
  hierarchy: PropTypes.object,

  onSelect: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MasterSchemaHierarchy;
