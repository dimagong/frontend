import React, { useState, useEffect } from "react";

import SectionsSideBar from "./Components/SectionsSideBar";
import SectionsComponent from "./Components/Sections";
import { DFormWidgetEventsTypes } from "./Components/Fields/Components/DFormWidgets/events";

import "./styles.scss";
import { DFormContextProvider } from "./dFormContext";

const DForm = ({
  dFormId,
  isConfigurable,
  onElementClick,
  onSectionCreate,
  onGroupCreate,
  data,
  values,
  onFieldEvent,
  isMemberView,
}) => {
  const [selectedSection, setSelectedSection] = useState("");
  const [sectionsProgress, setSectionsProgress] = useState(null);

  const handleElementClick = (element, elementType) => {
    onElementClick(element, elementType);
  };

  // const sectionsWithErrors = Object.keys(data.errors);

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

  const handleFieldEvent = (event) => {
    if (event.type === DFormWidgetEventsTypes.Create && isConfigurable) {
      onFieldEvent(event);
      return;
    }

    if (!isConfigurable) {
      onFieldEvent(event);
      return;
    }

    throw new Error("Unexpected usage of field creation event.");
  };

  const handleGroupCreate = () => {
    onGroupCreate(selectedSection);
  };

  const calculateProgress = () => {
    //**TODO calculate progress on values change.
  };

  const init = () => {
    if (!data.sections) return;

    initialiseSectionsProgress();
    //**TODO set first selected tab (default tab). Select first that occur and doesn't hidden
    setSelectedSection(Object.keys(data.sections)[0]);
  };

  useEffect(() => {
    calculateProgress();
  }, [data]);

  useEffect(init, []);

  useEffect(() => {
    if (!data.sectionsOrder || (!data.sectionsOrder.includes(selectedSection) && data.sectionsOrder.length)) {
      setSelectedSection((data.sectionsOrder && data.sectionsOrder[0]) || "");
    }
  }, [data.sectionsOrder]);

  return (
    <DFormContextProvider dFormId={dFormId} isConfigurable={isConfigurable} isMemberView={isMemberView}>
      <div className={`new-dform ${isConfigurable ? "edit-mode" : ""}`}>
        <SectionsSideBar
          onSectionSelect={handleSectionSelect}
          selectedSection={selectedSection}
          sectionsProgress={sectionsProgress}
          // errors={sectionsWithErrors}
          errors={[]}
          sections={data.sectionsOrder && data.sectionsOrder.map((sectionId) => data.sections[sectionId])}
          onSectionCreate={isConfigurable && onSectionCreate}
        />
        <SectionsComponent
          data={data}
          values={isConfigurable ? null : values}
          isConfigurable={isConfigurable}
          selectedSection={selectedSection}
          onElementClick={isConfigurable ? handleElementClick : () => {}}
          onGroupCreate={isConfigurable ? handleGroupCreate : () => {}}
          onFieldEvent={handleFieldEvent}
        />
      </div>
    </DFormContextProvider>
  );
};

export default DForm;
