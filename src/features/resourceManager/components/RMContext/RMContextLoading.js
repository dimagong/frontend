import React from "react";
import { Spinner } from "reactstrap";

import RMContextTemplate from "./RMContextTemplate";

const RMContextLoading = () => {
  return (
    <RMContextTemplate>
      <div className="d-flex justify-content-center pt-5">
        <Spinner color="primary" size="lg" />
      </div>
    </RMContextTemplate>
  );
};

export default RMContextLoading;
