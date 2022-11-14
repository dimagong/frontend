import "./styles.scss";

import { Button } from "reactstrap";
import { RefreshCw } from "react-feather";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";

const { updateDFormFromParentRequest } = appSlice.actions;

export default function UpdateApplicationToLatestVersion({ application }) {
  const dispatch = useDispatch();

  // This is to prevent all icons from rotating when only one application is updating
  const [isCurrentApplicationUpdateStarted, setIsCurrentApplicationUpdateStarted] = useState(false);

  const isDFormUpdateProcessing = useSelector(createLoadingSelector([updateDFormFromParentRequest.type], true));

  const onRefresh = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    setIsCurrentApplicationUpdateStarted(true);
    dispatch(updateDFormFromParentRequest({ application }));
  };

  const isLoading = isDFormUpdateProcessing;

  useEffect(() => {
    if (!isLoading) {
      setIsCurrentApplicationUpdateStarted(false);
    }
  }, [isLoading]);

  return (
    <Button outline color="primary" className={"update-application-component bg-white"} onClick={onRefresh}>
      <RefreshCw
        size={15}
        className={`update-application-component_refresh-button ${
          isLoading && isCurrentApplicationUpdateStarted ? "processing" : ""
        }`}
      />
    </Button>
  );
}
