import React from "react";
import { Spinner } from "reactstrap";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";

import { resourceManagerService } from "api/resourceManager";

import RMList from "./RMList";

const { setContext, setSelectedResourceManager } = appSlice.actions;

const RMContextSearch = () => {
  const dispatch = useDispatch();
  const { data: rManagers, isLoading } = useQuery("resource-managers", resourceManagerService.getAll);

  const onRManagerSelect = (rManager) => {
    dispatch(setSelectedResourceManager(rManager));
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
      <RMList rManagers={rManagers} onSelect={onRManagerSelect} />
    </div>
  );
};

export default RMContextSearch;
