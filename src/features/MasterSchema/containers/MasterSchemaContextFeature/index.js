import React from "react";
import PropTypes from "prop-types";

import MasterSchemaContextFeatureComponent from "./components/MasterSchemaContextFeatureComponent";

const MasterSchemaContextFeature = ({ selectable }) => {
  return <MasterSchemaContextFeatureComponent selectable={selectable} />;
};

MasterSchemaContextFeature.propTypes = {
  selectable: PropTypes.object,
};

export default MasterSchemaContextFeature;
