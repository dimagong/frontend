import React from 'react';

import MasterSchemaContextComponent from "./components/MasterSchemaContextComponent";
import MasterSchemaElementTree from './components/MasterSchemaElementTree';

const MasterSchemaContext = () => {

  return (
    <MasterSchemaContextComponent>
      <MasterSchemaElementTree />
    </MasterSchemaContextComponent>
  )
};

export default MasterSchemaContext;
