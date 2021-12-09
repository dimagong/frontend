import "./styles.scss";

import _ from "lodash";
import { get } from "lodash/fp";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useMemo, useRef, useState } from "react";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import { useDidMount } from "hooks/use-did-mount";
import { useDidUpdate } from "hooks/use-did-update";
import SearchAndFilter from "components/SearchAndFilter";
import ContextTemplate from "components/ContextTemplate";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const { getMasterSchemaHierarchyRequest, getdFormsRequest, setMasterSchemaSearch } = appSlice.actions;

const MasterSchemaContextComponent = ({ state }) => {
  const dispatch = useDispatch();
  const allDForms = useSelector(selectdForms);
  const search = useSelector(masterSchemaSelectors.selectSearch);
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);

  const { nodes, hierarchy, unapproved, expandable, onNodeSelect } = state;

  const expandAllElements = useCallback(() => expandable.setKeys(nodes.map(get("nodeId"))), [expandable, nodes]);

  const isSearchingRef = useRef(false);
  const [filterTypes, setFilterTypes] = useState([]);
  const filterNames = useMemo(() => filterTypes.map(get("name")), [filterTypes]);

  const onSearchSubmit = (searchName) => {
    const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;
    dispatch(setMasterSchemaSearch({ ...search, value: searchValue }));
  };

  const onFilterSubmit = (filterOptions, filter) => {
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

    if (hierarchy.name) {
      setFilterTypes(
        allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0)
      );
    }
  });

  useDidUpdate(() => (isSearchingRef.current = true), [search]);

  useDidUpdate(() => {
    if (isSearchingRef.current) {
      expandAllElements();
      isSearchingRef.current = false;
    }
  }, [hierarchy]);

  useDidUpdate(() => void dispatch(getMasterSchemaHierarchyRequest({ id: selectedId })), [search]);

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!isEmpty(unapproved?.fields) && <UnapprovedFieldsComponent fields={unapproved.fields} />}

      <SearchAndFilter
        placeholder={" "}
        className={"ms-search-and-filter"}
        handleSearch={onSearchSubmit}
        onCancelFilter={onFilterCancel}
        filterTypes={{ applications: filterNames }}
        applyFilter={onFilterSubmit}
        onCalendarChange={onCalendarChange}
        isCalendar
        hasIcon
        filterTabPosition={"left"}
      />

      {hierarchy?.id ? (
        <MasterSchemaElements state={state} onNodeSelect={onNodeSelect} />
      ) : (
        <h2 className={"ms-nothing-was-found"}>Nothing was found for your query</h2>
      )}
    </ContextTemplate>
  );
};

MasterSchemaContextComponent.propTypes = {
  state: PropTypes.object.isRequired,
};

export default MasterSchemaContextComponent;
