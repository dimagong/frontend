import React, { useState, } from 'react';

import ContextTemplate from "components/ContextTemplate";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import DForm from "components/DForm";
import DFormElementEdit from "./Components/DFormElementEdit";

const Applications = ({ isConfigurable }) => {

  const [isModuleEditComponentVisible, setIsModuleEditComponentVisible] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  const handleSelectElementForEdit = (element) => {
    console.log(element);
    setSelectedElement(element);
    setIsModuleEditComponentVisible(true);
  };

  const handleSectionCreate = () => {

  };

  const handleGroupCreate = () => {

  };

  const handleFieldCreate = () => {

  };

  return (
    <div className="d-flex">
      <ContextTemplate contextTitle="Applications" contextName="dForm » introduction">
        <DForm
          isConfigurable={isConfigurable}
          onElementClick={handleSelectElementForEdit}
          onSectionCreate={handleSectionCreate}
          onGroupCreate={handleGroupCreate}
          onFieldCreate={handleFieldCreate}
        />
      </ContextTemplate>
      {isModuleEditComponentVisible && (
        <ContextFeatureTemplate contextFeatureTitle="dForm">
          <DFormElementEdit />
        </ContextFeatureTemplate>
      )}
    </div>
  )
};

export default Applications;
