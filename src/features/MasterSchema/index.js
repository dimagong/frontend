import React from 'react';

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const MasterSchema = () => {

  return (
    <div className="d-flex">
      <MasterSchemaContext />
      <MasterSchemaContextFeature />
    </div>
  )
};

export default MasterSchema;
