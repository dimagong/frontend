import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";

import RMContextFeatureTemplate from "./RMContextFeatureTemplate";

const RMContextFeatureLoading = ({ field }) => {
  return (
    <RMContextFeatureTemplate field={field}>
      <div className="d-flex justify-content-center align-items-center">
        <Spinner color="primary" />
      </div>
    </RMContextFeatureTemplate>
  );
};

RMContextFeatureLoading.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeatureLoading;
