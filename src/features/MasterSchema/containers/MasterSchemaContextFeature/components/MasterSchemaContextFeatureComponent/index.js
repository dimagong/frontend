import React from 'react';

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import MasterSchemaManager from './components/MasterSchemaManager';

const MasterSchemaContextFeatureComponent = () => {

  return (
    <ContextFeatureTemplate contextFeatureTitle="Manage Datapoint">
      {/*<MasterSchemaUserList />*/}
      <MasterSchemaManager />
    </ContextFeatureTemplate>
  )
};

export default MasterSchemaContextFeatureComponent;
