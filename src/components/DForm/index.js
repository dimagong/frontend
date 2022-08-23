import "./styles.scss";

import React, { useState } from "react";

import { DFormContextProvider } from "./DFormContext";

import SectionsComponent from "./Components/Sections";
import SectionsSideBar from "./Components/SectionsSideBar";

const getInitialSelectedSection = (data) => (data.sectionsOrder ? data.sectionsOrder[0] : "");

const getInitialSectionsProgress = (data) =>
  Object.values(data.sections).reduce((acc, curr) => ({ ...acc, [curr.name]: 0 }), {});

const DForm = (props) => {
  const {
    data,
    values,
    dFormId,
    isMemberView,
    selectedElement,
    onGroupCreate,
    isConfigurable,
    onElementClick,
    onSectionCreate,
    onFieldCreate,
    onFieldChange,
  } = props;

  const sectionsProgress = getInitialSectionsProgress(data);
  const [selectedSection, setSelectedSection] = useState(() => getInitialSelectedSection(data));

  const handleElementClick = (element, elementType) => {
    onElementClick(element, elementType);
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

  return (
    <DFormContextProvider dFormId={dFormId} isConfigurable={isConfigurable} isMemberView={isMemberView}>
      <div className={`new-dform ${isConfigurable ? "edit-mode" : ""}`}>
        <SectionsSideBar
          errors={[]}
          selectedSection={selectedSection}
          sectionsProgress={sectionsProgress}
          sections={data.sectionsOrder && data.sectionsOrder.map((sectionId) => data.sections[sectionId])}
          onSectionSelect={handleSectionSelect}
          onSectionCreate={isConfigurable && onSectionCreate}
        />
        <SectionsComponent
          data={data}
          values={isConfigurable ? null : values}
          isConfigurable={isConfigurable}
          selectedSection={selectedSection}
          selectedElement={isConfigurable ? selectedElement : null}
          onElementClick={isConfigurable ? handleElementClick : () => {}}
          onGroupCreate={isConfigurable ? handleGroupCreate : () => {}}
          onFieldCreate={onFieldCreate}
          onFieldChange={onFieldChange}
        />
      </div>
    </DFormContextProvider>
  );
};

export default DForm;
