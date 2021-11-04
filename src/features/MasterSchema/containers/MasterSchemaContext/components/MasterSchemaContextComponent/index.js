import React from 'react';


import ContextTemplate from "components/ContextTemplate";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const MasterSchemaContextComponent = ({
  unapprovedFields,
  selectedUnapprovedFields,
  onUnapprovedFieldClick,
  onAllUnapprovedFieldsUnselect,
  onListOfUnapprovedElementsVisibilityToggle,
  isListOfUnapprovedElementsVisible,
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

    </ContextTemplate>
  )
};

export default MasterSchemaContextComponent;
