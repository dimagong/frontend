import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import { useRMFieldFiles } from "api/resourceManager/useRMFieldFiles";

import RMContextFeatureLoading from "./RMContextFeatureLoading";
import RMContextFeatureDataView from "./RMContextFeatureDataView";

const RMContextFeature = ({ field, organizationId, organizationType }) => {
  const { isLoading } = useRMFieldFiles({ fieldId: field.id });

  if (isLoading) {
    return <RMContextFeatureLoading field={field} />;
  }

  return <RMContextFeatureDataView field={field} organizationId={organizationId} organizationType={organizationType} />;
};

RMContextFeature.propTypes = {
  field: PropTypes.object.isRequired,
  organizationId: IdType.isRequired,
  organizationType: PropTypes.string.isRequired,
};

export default RMContextFeature;
