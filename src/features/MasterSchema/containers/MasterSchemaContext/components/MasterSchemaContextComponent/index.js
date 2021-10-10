import React from 'react';
import ContextTemplate from "components/ContextTemplate";


const MasterSchemaContextComponent = ({ children }) => {

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {children}
    </ContextTemplate>
  )
};

export default MasterSchemaContextComponent;
