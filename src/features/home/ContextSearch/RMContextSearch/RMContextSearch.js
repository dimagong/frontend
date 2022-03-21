import React from "react";
import { Spinner } from "reactstrap";
import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";

import { useResourceManagers } from "features/ResourceManager/resourceManagerQueries";

import RMList from "./RMList";

const { setContext, setSelectedResourceManager } = appSlice.actions;

const RMContextSearch = () => {
  const dispatch = useDispatch();
  const { data: resourceManagers, isLoading } = useResourceManagers();

  const onSelect = (resourceManager) => {
    dispatch(setSelectedResourceManager(resourceManager));
    dispatch(setContext("resourceManager"));
  };

  if (isLoading) {
    return (
      <div className="height-400 d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="home__card-wrapper">
      <RMList resourceManagers={resourceManagers} onSelect={onSelect} />
    </div>
  );
};

export default RMContextSearch;
