import React, { useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import { selectMasterSchemaOrganizations } from "app/selectors/masterSchemaSelectors";

import MasterSchemaContextSearchComponent from "./components/MasterSchemaComponent";

import appSlice from "app/slices/appSlice";

const {
  getMasterSchemaOrganizationsRequest,

  setSelectedOrganizationMasterSchema,
  setContext,
} = appSlice.actions;

const MasterSchemaContextSearch = () => {
  const dispatch = useDispatch();

  const masterSchemaOrganizations = useSelector(selectMasterSchemaOrganizations);
  const isMasterSchemaOrganizationsLoading = useSelector(createLoadingSelector([getMasterSchemaOrganizationsRequest.type]));


  const handleOrganizationSelect = (organization) => {
    dispatch(setSelectedOrganizationMasterSchema({id: organization.id, type: organization.type}));
    dispatch(setContext("MasterSchema"));
  };

  useEffect(() => {
    dispatch(getMasterSchemaOrganizationsRequest())
  }, []);

  return (
    <MasterSchemaContextSearchComponent
      organizations={masterSchemaOrganizations}
      isMasterSchemaOrganizationsLoading={isMasterSchemaOrganizationsLoading}
      onOrganizationSelect={handleOrganizationSelect}
    />
  )
};

export default MasterSchemaContextSearch;
