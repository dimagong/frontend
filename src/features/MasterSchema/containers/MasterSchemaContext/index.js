import React from 'react';

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";
import MasterSchemaMainSection from './components/MasterSchemaElements';

const MasterSchemaContext = () => {

  return (
    <MasterSchemaContextComponent>
      <MasterSchemaMainSection />
    </MasterSchemaContextComponent>
  )
};

export default MasterSchemaContext;
