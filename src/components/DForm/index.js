import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

import SectionsSideBar from './Components/SectionsSideBar';
import SectionsComponent from './Components/Sections';

import './styles.scss';

const DForm = ({
  isConfigurable,
  onElementClick,
  onSectionCreate,
  onGroupCreate,
  onFieldCreate,
}) => {

  const [selectedSection, setSelectedSection] = useState("");
  const [sectionsProgress, setSectionsProgress] = useState(null);

  const data = {
    "type": "application",
    "name": "Dform name",
    "description": "description",
    "isPrivate": false,
    "sections": {
      "First section": {
        "name": "First section",
        "isProtected": false,
        "isDisabled": false,
        "isHidden": false,
        "isAlreadyViewed": false, // Need it to mark section with tick when it have 0 fields that needs to be filled
        "relatedGroups": ["Group one", "Second group"],
        "conditions": ""
      }
    },
    "groups": {
      "Group one": {
        "id": "Group one",
        "isProtected": false,
        "relatedFields": [1, 2, 3]
      },
      "Second group": {
        "id": "Second group",
        "isProtected": false,
        "relatedFields": [4]
      }
    },
    "fields": {
      "1": {
        "id": "1",
        "isMasterSchemaRelated": false,
        "type": "Text",
        "title": "Some text",
        "isRequired": true,
        "classes": "col-md-12",
      },
      "2": {
        "id": "2",
        "isMasterSchemaRelated": true,
        "type": "TextArea",
        "title": "Your biography",
        "isRequired": true,
        "classes": "col-md-12",
      },
      "3": {
        "id": "3",
        "isMasterSchemaRelated": true,
        "type": "Select",
        "title": "Select your country"
      },
      "4": {
        "id": "4",
        "isMasterSchemaRelated": true,
        "type": "Text",
        "title": "Email of your best friend"
      }
    },
    errors: {

    }
  };

  const handleElementClick = (element) => {
    onElementClick(element);
  };

  const sectionsWithErrors = Object.keys(data.errors);

  // Initialise all sections progresses with key value pairs where key is section name (uniq) and value is 0
  const initialiseSectionsProgress = () => {
    setSectionsProgress(Object.values(data.sections).reduce((acc, curr) => ({...acc, [curr.name]: 0}), {}))
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);

    if (!data.sections[section].isAlreadyViewed) {
      /*TODO move this to parent component that handle ONBOARDING
       * make an api call in parent component to mark section as "already viewed"
       */
      // dFormApi.updateViewedSections(...);
    }
  };

  const calculateProgress = () => {
    //**TODO calculate progress on values change.
  };

  const init = () => {
    initialiseSectionsProgress();
    //**TODO set first selected tab (default tab). Select first that occur and doesn't hidden
    setSelectedSection(Object.keys(data.sections)[0])
  };

  useEffect(() => {
    calculateProgress()
  }, [data]);

  useEffect(init, []);

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
        onElementClick={isConfigurable ? handleElementClick : ()=>{}}
        onGroupCreate={isConfigurable && onGroupCreate}
        onFieldCreate={isConfigurable && onFieldCreate}
      />
    </div>
  )
};

DForm.propTypes = {

};

export default DForm;
