import "./styles.scss";

import _ from "lodash";
import { isEmpty } from "lodash/fp";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";

import {selectdForms} from "app/selectors";
import appSlice from "app/slices/appSlice";
import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import SearchAndFilter from "components/SearchAndFilter";
import ContextTemplate from "components/ContextTemplate";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const { getMasterSchemaHierarchyRequest, getdFormsRequest } = appSlice.actions;

const MasterSchemaContextComponent = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const allDForms = useSelector(selectdForms);
  const [currSearchName, setCurrSearchName] = useState('');
  const [currFilterOptions, setCurrFilterOptions] = useState([]);

  const onSearchSubmit = (searchName) => {
    let currSearch = searchName.hasOwnProperty('target') ?  searchName.target.value : searchName;
    const payload = { id: selectedId, name: currSearch, application_ids: currFilterOptions };
    dispatch(getMasterSchemaHierarchyRequest(payload));
    setCurrSearchName(currSearch);
  };

  const onFilterSubmit = (filterOptions, filter) => {
    let application_ids = _.intersectionBy(allDForms.filter(item =>
        item.groups.filter(group => group.name === hierarchy.name).length > 0),
        filter.applications.map(item => {return {name: item}}), 'name').map(item => item.id);
    const payload = { id: selectedId, name: currSearchName, application_ids: application_ids };
    dispatch(getMasterSchemaHierarchyRequest(payload));
    setCurrFilterOptions(application_ids);
  };

  const onFilterCancel = () => {
    const payload = { id: selectedId, name: currSearchName, application_ids: [] };
    dispatch(getMasterSchemaHierarchyRequest(payload));
    setCurrFilterOptions([]);
  }

  useEffect(() => void dispatch(getdFormsRequest()), []);

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!isEmpty(unapproved.fields) && <UnapprovedFieldsComponent fields={unapproved.fields} />}

      <SearchAndFilter
        handleSearch={onSearchSubmit}
        onCancelFilter={onFilterCancel}
        filterTypes={{applications: allDForms.filter(item =>
            item.groups.filter(group => group.name === hierarchy.name).length > 0)
            .map(item => item.name)}}
        applyFilter={onFilterSubmit}
        isCalendar
        onCalendarChange={() => {}}
      />

      {hierarchy?.id
        ? <MasterSchemaElements
        expanded
        hierarchy={hierarchy}
        key={hierarchy.name}
      />
      : <h2>Nothing was found for your query</h2>}
    </ContextTemplate>
  );
};

export default MasterSchemaContextComponent;
