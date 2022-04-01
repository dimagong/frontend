import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";

import RMContextFeatureLoading from "./RMContextFeatureLoading";
import RMContextFeatureDataView from "./RMContextFeatureDataView";

import { useRMFieldFiles } from "api/resourceManager/useRMFieldFiles";

const RMContextFeature = ({ field, resourceManager }) => {
  const { isLoading } = useRMFieldFiles({ fieldId: field.id });

  if (isLoading) {
    return <RMContextFeatureLoading field={field} />;
  }

  return <RMContextFeatureDataView field={field} resourceManager={resourceManager} />;
};

RMContextFeature.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeature;
