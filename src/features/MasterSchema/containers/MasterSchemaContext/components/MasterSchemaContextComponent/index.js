import React from 'react';

import ContextTemplate from "components/ContextTemplate";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";
import MasterSchemaElements from "../MasterSchemaElements";
import MSEApproveElements from "../MasterSchemaElements/components/mse-approve-elements";

const MasterSchemaContextComponent = ({
  unapprovedFields,
  selectedUnapprovedFields,
  onUnapprovedFieldClick,
  onAllUnapprovedFieldsUnselect,
  onListOfUnapprovedElementsVisibilityToggle,
  isListOfUnapprovedElementsVisible,
  selectedOrganizationMasterSchema,
}) => {

  const onApproveElements = (elements) => {
    if (elements.length === 0) {
      alert('eblan?');
      return;
    }
    console.log('elements finished', elements)
  }

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
      {!!unapprovedFields.length && (
        <MSEApproveElements
          elements={selectedUnapprovedFields}
          groups={selectedOrganizationMasterSchema.root.groups.filter(item => item.name !== 'Unapproved')}
          submitting={false}
          onSubmit={onApproveElements}
        />
      )}
      <MasterSchemaElements root={selectedOrganizationMasterSchema.root} key={selectedOrganizationMasterSchema.name} />
    </ContextTemplate>
  )
};

export default MasterSchemaContextComponent;
