import "./styles.scss";

import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { useBoolean } from "hooks/use-boolean";
import ContextTemplate from "components/ContextTemplate";
import { selectSelectedId } from "app/selectors/masterSchemaSelectors";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";
import SearchAndFilter from "components/SearchAndFilter";
import {selectdForms} from "app/selectors";
import _ from "lodash";

const { getMasterSchemaHierarchyRequest, getdFormsRequest } = appSlice.actions;

const MasterSchemaContextComponent = ({
  unapprovedFields,
  selectedMasterSchemaHierarchy,
  selectedUnapprovedFields,
  onUnapprovedFieldClick,
  onAllUnapprovedFieldsUnselect,
  onListOfUnapprovedElementsVisibilityToggle,
  isListOfUnapprovedElementsVisible,
}) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const [currSearchName, setCurrSearchName] = useState('');
  const [currFilterOptions, setCurrFilterOptions] = useState([]);
  const allDForms = useSelector(selectdForms);

  const [expanded] = useBoolean(true);


  const onSearchSubmit = (searchName) => {
    let currSearch = searchName.hasOwnProperty('target') ?  searchName.target.value : searchName;
    const payload = { id: selectedId, name: currSearch, application_ids: currFilterOptions };
    dispatch(getMasterSchemaHierarchyRequest(payload));
    setCurrSearchName(currSearch);
  };

  const onFilterSubmit = (filterOptions, filter) => {
    let application_ids = _.intersectionBy(allDForms.filter(item =>
        item.groups.filter(group => group.name === selectedMasterSchemaHierarchy.name).length > 0),
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

  useEffect(() => {
    dispatch(getdFormsRequest())
  }, [])


  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!!unapprovedFields.length && (
        <UnapprovedFieldsComponent
          fields={unapprovedFields}
          selectedFields={selectedUnapprovedFields}
          onFieldClick={onUnapprovedFieldClick}
          onUnselectAll={onAllUnapprovedFieldsUnselect}
          isListVisible={isListOfUnapprovedElementsVisible}
          onListVisibilityToggle={onListOfUnapprovedElementsVisibilityToggle}
        />
      )}

      <SearchAndFilter
        handleSearch={onSearchSubmit}
        onCancelFilter={onFilterCancel}
        filterTypes={{applications: allDForms.filter(item =>
            item.groups.filter(group => group.name === selectedMasterSchemaHierarchy.name).length > 0)
            .map(item => item.name)}}
        applyFilter={onFilterSubmit}
        isCalendar
        onCalendarChange={() => {}}
      />

      {selectedMasterSchemaHierarchy?.id
        ? <MasterSchemaElements
        expanded={expanded}
        hierarchy={selectedMasterSchemaHierarchy}
        key={selectedMasterSchemaHierarchy.name}
      />
      : <h2>Nothing was found for your query</h2>}
    </ContextTemplate>
  );
};

export default MasterSchemaContextComponent;
