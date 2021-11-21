import React from 'react';


import ContextTemplate from "components/ContextTemplate";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";
import MasterSchemaElements from "../MasterSchemaElements";

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
      <MasterSchemaElements root={selectedOrganizationMasterSchema.root} />
    </ContextTemplate>
  )
};

export default MasterSchemaContextComponent;
