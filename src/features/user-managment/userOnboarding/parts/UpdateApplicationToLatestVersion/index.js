import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import { RefreshCw } from "react-feather";
import { Button } from "reactstrap";

import appSlice from "app/slices/appSlice";

import "./styles.scss";

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
    dispatch(updateDFormFromParentRequest({ id: application.d_form.id }));
  };

  const isLoading = isDFormUpdateProcessing;

  useEffect(() => {
    if (!isLoading) {
      setIsCurrentApplicationUpdateStarted(false);
    }
  }, [isLoading]);

  return (
    <Button.Ripple outline color="primary" className={"update-application-component bg-white"} onClick={onRefresh}>
      <RefreshCw
        size={15}
        className={`update-application-component_refresh-button ${
          isLoading && isCurrentApplicationUpdateStarted ? "processing" : ""
        }`}
      />
    </Button.Ripple>
  );
}
