import React from 'react';

import ContextTemplate from "components/ContextTemplate";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const MasterSchemaContextComponent = ({
  unapprovedFields,
  selectedUnapprovedFields,
  onUnapprovedFieldClick,
  onAllUnapprovedFieldsUnselect,
  onListOfUnapprovedElementsVisibilityToggle,
  isListOfUnapprovedElementsVisible,
  selectedOrganizationMasterSchema,
}) => {

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!!unapprovedFields.length && (
        <UnapprovedFieldsComponent
          fields={unapprovedFields}
          selectedFields={selectedUnapprovedFields}
          onFieldClick={onUnapprovedFieldClick}
          onUnselectAll={onAllUnapprovedFieldsUnselect}
          isListVisible={isListOfUnapprovedElementsVisible}
          onListVisibilityToggle={onListOfUnapprovedElementsVisibilityToggle}
        />
      )}
      <MasterSchemaElements root={selectedOrganizationMasterSchema.root} key={selectedOrganizationMasterSchema.name} />
    </ContextTemplate>
  )
};

export default MasterSchemaContextComponent;
