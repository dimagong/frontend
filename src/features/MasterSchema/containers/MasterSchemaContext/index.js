import React from 'react';

import MasterSchemaElements from './components/MasterSchemaElements';
import MasterSchemaContextComponent from './components/MasterSchemaContextComponent';

const MasterSchemaContext = () => {
  return (
    <MasterSchemaContextComponent>
      <MasterSchemaElements />
    </MasterSchemaContextComponent>
  );
};

export default MasterSchemaContext;
