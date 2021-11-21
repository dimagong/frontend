import React from 'react';

import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import MasterSchemaUserList from "../MasterSchemaUserList";
import MSENodeRenamingForm
  from "../../../MasterSchemaContext/components/MasterSchemaElements/components/mse-node-renaming-form";
import MSENodeRelocationForm
  from "../../../MasterSchemaContext/components/MasterSchemaElements/components/mse-node-relocation-form";

const MasterSchemaContextFeatureComponent = () => {

  return (
    <ContextFeatureTemplate contextFeatureTitle="Temporary title">
      {/*<MasterSchemaUserList />*/}
      <MSENodeRenamingForm className="my-2" nodeId={'1'} submitting={false} onSubmit={() => {}} />
      <MSENodeRelocationForm className="my-2" submitting={false} onSubmit={() => {}} />
    </ContextFeatureTemplate>
  )
};

export default MasterSchemaContextFeatureComponent;
