import React from 'react';

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import MasterSchemaManager from './components/MasterSchemaManager';

const MasterSchemaContextFeatureComponent = () => {

  return (
    <ContextFeatureTemplate contextFeatureTitle="Temporary title">
      {/*<MasterSchemaUserList />*/}
      <MasterSchemaManager />
    </ContextFeatureTemplate>
  )
};

export default MasterSchemaContextFeatureComponent;
