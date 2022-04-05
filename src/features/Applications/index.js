import React, { useState, } from 'react';

import ContextTemplate from "components/ContextTemplate";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import DForm from "components/DForm";
import DFormElementEdit from "./Components/DFormElementEdit";

const Applications = ({ isConfigurable }) => {

  const [selectedElement, setSelectedElement] = useState(null);

  const handleSelectElementForEdit = (element) => {
    setSelectedElement(element);
  };

  const handleSectionCreate = () => {

  };

  return (
    <div>
      <ContextTemplate contextTitle="Applications" contextName="dForm > introduction">
        <DForm
          isConfigurable={isConfigurable}
          onElementClick={handleSelectElementForEdit}
          onSectionCreate={handleSectionCreate}
        />
      </ContextTemplate>
      {!!selectedElement && (
        <ContextFeatureTemplate>
          <DFormElementEdit />
        </ContextFeatureTemplate>
      )}
    </div>
  )
};

export default Applications;
