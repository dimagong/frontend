import React, { useState, useEffect } from "react";
import propTypes from "prop-types";

import SectionsSideBar from "./Components/SectionsSideBar";
import SectionsComponent from "./Components/Sections";

import "./styles.scss";

const DForm = ({ isConfigurable, onElementClick, onSectionCreate, onGroupCreate, onFieldCreate, data }) => {
  const [selectedSection, setSelectedSection] = useState("");
  const [sectionsProgress, setSectionsProgress] = useState(null);

  const handleElementClick = (element, elementType) => {
    onElementClick(element, elementType);
  };

  const sectionsWithErrors = Object.keys(data.errors);

  // Initialise all sections progresses with key value pairs where key is section name (uniq) and value is 0
  const initialiseSectionsProgress = () => {
    setSectionsProgress(Object.values(data.sections).reduce((acc, curr) => ({ ...acc, [curr.name]: 0 }), {}));
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);

    if (isConfigurable) {
      handleElementClick(data.sections[section], "section");
    }

    if (!data.sections[section].isAlreadyViewed) {
      /*TODO move this to parent component that handle ONBOARDING
       * make an api call in parent component to mark section as "already viewed"
       */
      // dFormApi.updateViewedSections(...);
    }
  };

  const handleGroupCreate = () => {
    onGroupCreate(selectedSection);
  };

  const calculateProgress = () => {
    //**TODO calculate progress on values change.
  };

  const init = () => {
    initialiseSectionsProgress();
    //**TODO set first selected tab (default tab). Select first that occur and doesn't hidden
    setSelectedSection(Object.keys(data.sections)[0]);
  };

  useEffect(() => {
    calculateProgress();
  }, [data]);

  useEffect(init, []);

  useEffect(() => {
    if (!data.sectionsOrder.includes(selectedSection) && data.sectionsOrder.length) {
      setSelectedSection(data.sectionsOrder[0]);
    }
  }, [data.sectionsOrder]);

  return (
    <div className={`new-dform ${isConfigurable ? "edit-mode" : ""}`}>
      <SectionsSideBar
        onSectionSelect={handleSectionSelect}
        selectedSection={selectedSection}
        sectionsProgress={sectionsProgress}
        errors={sectionsWithErrors}
        sections={Object.values(data.sections)}
        onSectionCreate={isConfigurable && onSectionCreate}
      />
      <SectionsComponent
        data={data}
        selectedSection={selectedSection}
        onElementClick={isConfigurable ? handleElementClick : () => {}}
        onGroupCreate={isConfigurable && handleGroupCreate}
        onFieldCreate={isConfigurable && onFieldCreate}
      />
    </div>
  );
};

DForm.propTypes = {};

export default DForm;
