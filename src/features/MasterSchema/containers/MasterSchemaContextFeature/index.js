import React from 'react';

import MasterSchemaUserList from './components/MasterSchemaUserList';
import MasterSchemaContextFeatureComponent from './components/MasterSchemaContextFeatureComponent';

const MasterSchemaContextFeature = () => {
  return (
    <MasterSchemaContextFeatureComponent>
      <MasterSchemaUserList />
    </MasterSchemaContextFeatureComponent>
  );
};

export default MasterSchemaContextFeature;
