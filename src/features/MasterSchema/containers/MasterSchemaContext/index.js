import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";

import {
  selectUnapprovedFieldsOfSelectedOrganization,
} from "app/selectors/masterSchemaSelectors";

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";

const MasterSchemaContext = () => {
  const dispatch = useDispatch();

  const [selectedUnapprovedFields, setSelectedUnapprovedFields] = useState([]);
  const [isListOfUnapprovedElementsVisible, setIsListOfUnapprovedElementsVisible] = useState(true);

  const selectedOrganizationUnapprovedFields = useSelector(selectUnapprovedFieldsOfSelectedOrganization);


  const handleUnapprovedFieldSelect = (field) => {
    setSelectedUnapprovedFields([...selectedUnapprovedFields, field]);
  };

  const handleUnapprovedFieldUnselect = (field) => {
    setSelectedUnapprovedFields(selectedUnapprovedFields.filter(selectedField => selectedField !== field))
  };

  const handleAllUnapprovedFieldsUnselect = () => {
    setSelectedUnapprovedFields([]);
  };

  const handleUnapprovedFieldClick = (field) => {
    if (selectedUnapprovedFields.includes(field)) {
      handleUnapprovedFieldUnselect(field);
    } else {
      handleUnapprovedFieldSelect(field);
    }
  };

  const handleListOfUnapprovedElementsVisibilityToggle = () => {
    setIsListOfUnapprovedElementsVisible(!isListOfUnapprovedElementsVisible)
  };

  // Unselect all on organization change
  useEffect(() => {
    handleAllUnapprovedFieldsUnselect();
  }, [selectedOrganizationUnapprovedFields]);

  return (
    <MasterSchemaContextComponent
      unapprovedFields={selectedOrganizationUnapprovedFields}
      selectedUnapprovedFields={selectedUnapprovedFields}
      onUnapprovedFieldClick={handleUnapprovedFieldClick}
      onAllUnapprovedFieldsUnselect={handleAllUnapprovedFieldsUnselect}
      onListOfUnapprovedElementsVisibilityToggle={handleListOfUnapprovedElementsVisibilityToggle}
      isListOfUnapprovedElementsVisible={isListOfUnapprovedElementsVisible}
    />
  )
};

export default MasterSchemaContext;
