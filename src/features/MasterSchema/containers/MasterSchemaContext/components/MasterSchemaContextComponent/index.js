import "./styles.scss";

import _ from "lodash";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import SearchAndFilter from "components/SearchAndFilter";
import ContextTemplate from "components/ContextTemplate";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const { getMasterSchemaHierarchyRequest, getdFormsRequest } = appSlice.actions;

const MasterSchemaContextComponent = ({ state }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);

  const { hierarchy, unapproved, selectable, onNodeSelect } = state;

  const allDForms = useSelector(selectdForms);
  const [currSearchName, setCurrSearchName] = useState("");
  const [currSelectedFilterOptions, setCurrSelectedFilterOptions] = useState([]);
  const [currFilterOptions, setCurrFilterOptions] = useState([]);

  const onSearchSubmit = (searchName) => {
    let currSearch = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;
    const payload = { id: selectedId, name: currSearch, application_ids: currSelectedFilterOptions };
    dispatch(getMasterSchemaHierarchyRequest(payload));
    setCurrSearchName(currSearch);
  };

  const onFilterSubmit = (filterOptions, filter) => {
    let application_ids = _.intersectionBy(
      allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0),
      filter.applications.map((item) => {
        return { name: item };
      }),
      "name"
    ).map((item) => item.id);
    const payload = { id: selectedId, name: currSearchName, application_ids: application_ids };
    dispatch(getMasterSchemaHierarchyRequest(payload));
    setCurrSelectedFilterOptions(application_ids);
  };

  const onFilterCancel = () => {
    const payload = { id: selectedId, name: currSearchName, application_ids: [] };
    dispatch(getMasterSchemaHierarchyRequest(payload));
    setCurrSelectedFilterOptions([]);
  };

  useEffect(() => void dispatch(getdFormsRequest()), []);


  useEffect(() => {
    if (hierarchy.name) {
      setCurrFilterOptions(allDForms
            .filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0)
            .map((item) => item.name))
    }
  }, [hierarchy]);


  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!isEmpty(unapproved.fields) && <UnapprovedFieldsComponent fields={unapproved.fields} />}

      <SearchAndFilter
        handleSearch={onSearchSubmit}
        onCancelFilter={onFilterCancel}
        filterTypes={{
          applications: currFilterOptions,
        }}
        applyFilter={onFilterSubmit}
        onCalendarChange={() => {}}
      />

      {hierarchy?.id ? (
        <MasterSchemaElements
          expanded
          selectable={selectable}
          hierarchy={hierarchy}
          onNodeSelect={onNodeSelect}
          key={hierarchy.name}
        />
      ) : (
        <h2 className={'ms-nothing-was-found'}>Nothing was found for your query</h2>
      )}
    </ContextTemplate>
  );
};

MasterSchemaContextComponent.propTypes = {
  state: PropTypes.object.isRequired,
};

export default MasterSchemaContextComponent;
