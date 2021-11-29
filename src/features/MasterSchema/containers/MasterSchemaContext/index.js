import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";


import {
  selectSelectedMasterSchemaHierarchy,
  selectUnapprovedFieldsOfSelectedOrganization,
} from "app/selectors/masterSchemaSelectors";

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";

const MasterSchemaContext = () => {
  const [selectedUnapprovedFields, setSelectedUnapprovedFields] = useState([]);
  const [isListOfUnapprovedElementsVisible, setIsListOfUnapprovedElementsVisible] = useState(true);

  const selectedMasterSchemaHierarchy = useSelector(selectSelectedMasterSchemaHierarchy);
  const selectedOrganizationUnapprovedFields = useSelector(selectUnapprovedFieldsOfSelectedOrganization);

  const handleUnapprovedFieldSelect = (field) => {
    setSelectedUnapprovedFields([...selectedUnapprovedFields, field]);
  };

  const handleUnapprovedFieldUnselect = (field) => {
    setSelectedUnapprovedFields(selectedUnapprovedFields.filter((selectedField) => selectedField !== field));
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
    setIsListOfUnapprovedElementsVisible(!isListOfUnapprovedElementsVisible);
  };

  // Unselect all on organization change
  useEffect(() => {
    handleAllUnapprovedFieldsUnselect();
  }, [selectedOrganizationUnapprovedFields]);

  return (
    <MasterSchemaContextComponent
      unapprovedFields={selectedOrganizationUnapprovedFields}
      selectedMasterSchemaHierarchy={selectedMasterSchemaHierarchy}
      selectedUnapprovedFields={selectedUnapprovedFields}
      onUnapprovedFieldClick={handleUnapprovedFieldClick}
      onAllUnapprovedFieldsUnselect={handleAllUnapprovedFieldsUnselect}
      onListOfUnapprovedElementsVisibilityToggle={handleListOfUnapprovedElementsVisibilityToggle}
      isListOfUnapprovedElementsVisible={isListOfUnapprovedElementsVisible}
    />
  );
};

export default MasterSchemaContext;
