import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";
import {toast} from "react-toastify";
import appSlice from "../../../../app/slices/appSlice";

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";

import {
  selectUnapprovedFieldsOfSelectedOrganization,
  selectMasterSchemaOfSelectedOrganization,
} from "app/selectors/masterSchemaSelectors";

const {
  putNewAllowedElementsRequest
} = appSlice.actions;

const MasterSchemaContext = () => {
  const dispatch = useDispatch();

  const [selectedUnapprovedFields, setSelectedUnapprovedFields] = useState([]);
  const [isListOfUnapprovedElementsVisible, setIsListOfUnapprovedElementsVisible] = useState(true);

  const selectedOrganizationUnapprovedFields = useSelector(selectUnapprovedFieldsOfSelectedOrganization);
  const selectedOrganizationMasterSchema = useSelector(selectMasterSchemaOfSelectedOrganization);



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

  const handleOnApproveElements = (elements, group) => {
    if (!group?.value.hasOwnProperty('id')) {
      toast.error('Please choose the location');
      return;
    }
    dispatch(putNewAllowedElementsRequest({
      master_schema_field_ids: elements.map(item => item.id),
      master_schema_group_id: group.value.id
    }));

  }

  // Unselect all on organization change
  useEffect(() => {
    handleAllUnapprovedFieldsUnselect();
  }, [selectedOrganizationUnapprovedFields]);

  return (
    <MasterSchemaContextComponent
      unapprovedFields={selectedOrganizationUnapprovedFields}
      selectedOrganizationMasterSchema={selectedOrganizationMasterSchema}
      selectedUnapprovedFields={selectedUnapprovedFields}
      onUnapprovedFieldClick={handleUnapprovedFieldClick}
      onAllUnapprovedFieldsUnselect={handleAllUnapprovedFieldsUnselect}
      onListOfUnapprovedElementsVisibilityToggle={handleListOfUnapprovedElementsVisibilityToggle}
      isListOfUnapprovedElementsVisible={isListOfUnapprovedElementsVisible}
      onApproveElements={handleOnApproveElements}
    />
  )
};

export default MasterSchemaContext;
