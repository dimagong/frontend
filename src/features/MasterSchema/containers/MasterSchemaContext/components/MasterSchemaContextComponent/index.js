import React from 'react';

import ContextTemplate from "components/ContextTemplate";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";
import MSEApproveElements from "../../../../share/mse-approve-elements";

const MasterSchemaContextComponent = ({
  unapprovedFields,
  selectedUnapprovedFields,
  onUnapprovedFieldClick,
  onAllUnapprovedFieldsUnselect,
  onListOfUnapprovedElementsVisibilityToggle,
  isListOfUnapprovedElementsVisible,
  selectedOrganizationMasterSchema,
  onApproveElements
}) => {

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!!unapprovedFields.length && (
        <>
        <UnapprovedFieldsComponent
          fields={unapprovedFields}
          selectedFields={selectedUnapprovedFields}
          onFieldClick={onUnapprovedFieldClick}
          onUnselectAll={onAllUnapprovedFieldsUnselect}
          isListVisible={isListOfUnapprovedElementsVisible}
          onListVisibilityToggle={onListOfUnapprovedElementsVisibilityToggle}
        />
          <MSEApproveElements
            elements={selectedUnapprovedFields}
            submitting={false}
            onSubmit={onApproveElements}
          />
        </>
      )}

      <MasterSchemaElements root={selectedOrganizationMasterSchema.root} key={selectedOrganizationMasterSchema.name} />
    </ContextTemplate>
  )
};

export default MasterSchemaContextComponent;
