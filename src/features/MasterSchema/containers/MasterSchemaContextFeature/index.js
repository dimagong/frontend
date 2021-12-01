import React from "react";
import PropTypes from "prop-types";

import MasterSchemaContextFeatureComponent from "./components/MasterSchemaContextFeatureComponent";

const MasterSchemaContextFeature = ({ state }) => {
  return <MasterSchemaContextFeatureComponent state={state} />;
};

MasterSchemaContextFeature.propTypes = {
  state: PropTypes.object.isRequired,
};

export default MasterSchemaContextFeature;
