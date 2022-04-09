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
    const initialSectionData = {
      "name": "New Tab",
      "isProtected": false,
      "isDisabled": false,
      "isHidden": false,
      "isAlreadyViewed": false,
      "relatedGroups": [],
      "conditions": "",
    };

    initialSectionData.isNew = true;
    initialSectionData.type = "section";

    setSelectedElement(initialSectionData);
    setIsModuleEditComponentVisible(true);
  };

  const handleGroupCreate = () => {
    const initialGroupData = {
      "id": "New group",
      "isProtected": false,
      "relatedFields": []
    };

    initialGroupData.isNew = true;

    setSelectedElement(initialGroupData)
  };

  const handleFieldCreate = () => {
    const initialFieldData = {
      "id": "1",
      "type": "Text",
      "title": "New field",
      "isRequired": false,
      "classes": "col-md-12",
    };

    initialFieldData.isNew = true;

    setSelectedElement(initialFieldData)
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
          <DFormElementEdit element={selectedElement} />
        </ContextFeatureTemplate>
      )}
    </div>
  )
};

export default Applications;
