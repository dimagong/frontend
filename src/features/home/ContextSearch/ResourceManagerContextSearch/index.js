import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { selectOrganizations } from 'app/selectors/groupSelector'

import ResourceManagerContextSearchComponent from "./components/ResourceManagerContextSearchComponent";

import appSlice from 'app/slices/appSlice'

const {
  getOrganizationsRequest,
  setContext,
} = appSlice.actions;


const ResourceManagerContextSearch = () => {

  const dispatch = useDispatch();

  const organizationsData = useSelector(selectOrganizations);

  const handleOrganizationSelect = () => {
    dispatch(setContext("resourceManager"));
  };

  useEffect(() => {
    dispatch(getOrganizationsRequest())
  }, []);

  return (
    <ResourceManagerContextSearchComponent
      organizations={organizationsData}
      handleOrganizationSelect={handleOrganizationSelect}
    />
  )
};

export default ResourceManagerContextSearch;
