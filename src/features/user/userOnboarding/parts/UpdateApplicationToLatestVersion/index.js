import "./styles.scss";

import { Button } from "reactstrap";
import { RefreshCw } from "react-feather";
import React from "react";

import { useUpdateApplicationToLatestVersionMutation } from "./UpdateApplicationToLatestVersionQueries";

export default function UpdateApplicationToLatestVersion({ application }) {
  const updateApplication = useUpdateApplicationToLatestVersionMutation(application.id);

  const isUpdateApplicationLoading = updateApplication.isLoading;

  const onRefresh = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    updateApplication.mutate();
  };

  return (
    <Button outline color="primary" className={"update-application-component bg-white"} onClick={onRefresh}>
      <RefreshCw
        size={15}
        className={`update-application-component_refresh-button ${isUpdateApplicationLoading ? "processing" : ""}`}
      />
    </Button>
  );
}
