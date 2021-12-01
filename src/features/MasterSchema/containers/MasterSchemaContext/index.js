import React from "react";
import PropTypes from "prop-types";

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";

const MasterSchemaContext = ({ state }) => {
  return <MasterSchemaContextComponent state={state} />;
};

MasterSchemaContext.propTypes = {
  state: PropTypes.object.isRequired
};

export default MasterSchemaContext;
