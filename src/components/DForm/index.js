import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

import SectionsSideBar from './Components/SectionsSideBar';
import SectionsComponent from './Components/Sections';

import './styles.scss';

const DForm = () => {

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
        "isProtected": false,
        "relatedFields": [1, 2, 3]
      },
      "Second group": {
        "isProtected": false,
        "relatedFields": [4]
      }
    },
    "fields": {
      "1": {
        "isMasterSchemaRelated": false,
        "type": "Text",
        "name": "Some text"
      },
      "2": {
        "isMasterSchemaRelated": true,
        "type": "TextArea",
        "name": "Your biography"
      },
      "3": {
        "isMasterSchemaRelated": true,
        "type": "Select",
        "name": "Select your country"
      },
      "4": {
        "isMasterSchemaRelated": true,
        "type": "Text",
        "name": "Email of your best friend"
      }
    },
    errors: {

    }
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
  };

  useEffect(() => {
    calculateProgress()
  }, [data]);

  useEffect(init, []);

  return (
    <div className="new-dform">
      <SectionsSideBar
        onSectionSelect={handleSectionSelect}
        selectedSection={selectedSection}
        sectionsProgress={sectionsProgress}
        errors={sectionsWithErrors}
        sections={Object.values(data.sections)}
      />
      <SectionsComponent data={data} selectedSection={selectedSection} />
    </div>
  )
};

DForm.propTypes = {

};

export default DForm;
