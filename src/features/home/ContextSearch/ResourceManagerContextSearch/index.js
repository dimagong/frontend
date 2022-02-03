import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { createLoadingSelector } from "app/selectors/loadingSelector";
import ResourceManagerContextSearchComponent from "./components/ResourceManagerContextSearchComponent";
import { selectResourceManagersList } from "app/selectors/resourceManagerSelector";

import appSlice from 'app/slices/appSlice'

const {
  setContext,
  getResourceManagersListRequest,
  setSelectedResourceManager,
} = appSlice.actions;


const ResourceManagerContextSearch = () => {

  const dispatch = useDispatch();

  const resourceManagersList = useSelector(selectResourceManagersList);

  const isResourceManagerListLoading = createLoadingSelector([getResourceManagersListRequest.type]);

  const handleResourceManagerSelect = (resourceManager) => {
    dispatch(setSelectedResourceManager(resourceManager));
    dispatch(setContext("resourceManager"));
  };

  useEffect(() => {
    dispatch(getResourceManagersListRequest());
  }, []);

  return (
    <ResourceManagerContextSearchComponent
      resourceManagersList={resourceManagersList}
      handleResourceManagerSelect={handleResourceManagerSelect}
      isLoading={isResourceManagerListLoading}
    />
  )
};

export default ResourceManagerContextSearch;
