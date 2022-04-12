import React, {useEffect, useState,} from 'react';

import ContextTemplate from "components/ContextTemplate";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import DForm from "components/DForm";
import DFormElementEdit from "./Components/DFormElementEdit";

import {makeid} from "../../components/FormCreate/utils";

import { cloneDeep } from 'lodash'

import {INITIAL_FIELD_DATA, INITIAL_GROUP_DATA, INITIAL_SECTION_DATA} from "./constants";


const data = {
  "type": "application",
  "name": "Dform name",
  "description": "description",
  "isPrivate": false,
  "sections": {
    "First section": {
      "id": "First section",
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
      "name": "Group one",
      "id": "Group one",
      "isProtected": false,
      "relatedFields": [1, 2, 3]
    },
    "Second group": {
      "name": "Second group",
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
      "isLabelShowing": true,
    },
    "2": {
      "id": "2",
      "isMasterSchemaRelated": true,
      "type": "TextArea",
      "title": "Your biography",
      "isRequired": true,
      "classes": "col-md-12",
      "isLabelShowing": true,
    },
    "3": {
      "id": "3",
      "isMasterSchemaRelated": true,
      "type": "Select",
      "title": "Select your country",
      "isLabelShowing": true,
    },
    "4": {
      "id": "4",
      "isMasterSchemaRelated": true,
      "type": "Text",
      "title": "Email of your best friend",
      "isLabelShowing": true,
    }
  },
  errors: {

  }
};


const Applications = ({ isConfigurable }) => {

  const [fakeReduxData, setFakeReduxData] = useState(data);

  const [isModuleEditComponentVisible, setIsModuleEditComponentVisible] = useState(false);
  const [elementWithSuggestedChanges, setElementWithSuggestedChanges] = useState(null);
  const [dataWithSuggestedChanges, setDataWithSuggestedChanges] = useState(cloneDeep(fakeReduxData));

  const handleSelectElementForEdit = (element, elementType) => {
    console.log(element);
    setElementWithSuggestedChanges({...element, elementType});
    setIsModuleEditComponentVisible(true);
  };

  const getUniqNameForCollection = (collectionName, baseName) => {
    let tabIndex = 1;

    while(`${baseName} ${tabIndex}` in fakeReduxData[collectionName]) tabIndex++;

    return `${baseName} ${tabIndex}`
  };

  const handleSectionCreate = () => {
    const sectionName = getUniqNameForCollection("sections", "Tab");

    const newSectionData = {
      ...INITIAL_SECTION_DATA,
      id: sectionName,
      name: sectionName,
      elementType: "section",
      // isNew: true,
    };

    setFakeReduxData(embedSuggestedChanges(newSectionData, true));

    // setElementWithSuggestedChanges({...newSectionData});
    // setIsModuleEditComponentVisible(true);


    //TODO refactor this and all uses of isNew if creation wouldn't need approve by click "create"
    // Remove in case if approve will be needed
    // handleElementChangesSave();
  };

  const handleGroupCreate = (sectionId) => {
    const groupName = getUniqNameForCollection("groups", "Group");
    console.log("group create");
    const newGroupData = {
      ...INITIAL_GROUP_DATA,
      id: groupName,
      name: groupName,
      isNew: true,
    };

    const dataToSave = embedSuggestedChanges(newGroupData, true);

    // Add group to section where it was created
    dataToSave.sections[sectionId].relatedGroups = [...dataToSave.sections[sectionId].relatedGroups, newGroupData.id];

    setFakeReduxData(dataToSave);
  };

  //TODO make ID generator

  const handleFieldCreate = (group) => {
    const newFieldData = {
      ...INITIAL_FIELD_DATA,
      id: makeid(9),
      isNew: true,
    };

    const dataToSave = embedSuggestedChanges(newFieldData, true);

    // Add group to section where it was created
    dataToSave.groups[group].relatedFields = [...dataToSave.groups[group].relatedFields, newFieldData.id];

    setFakeReduxData(dataToSave);
  };

  const getElementCollectionName = (element) => {
    let elementCollectionName;

    switch(true) {
      case element.hasOwnProperty("relatedGroups"): elementCollectionName = "sections"; break;
      case element.hasOwnProperty("relatedFields"): elementCollectionName = "groups"; break;
      default: elementCollectionName = "fields"; break;
    }

    return elementCollectionName;
  };

  const embedSuggestedChanges = (element = elementWithSuggestedChanges, isNewElement) => {

    const collectionName = getElementCollectionName(element);
    console.log(collectionName);
    const dataClone = cloneDeep(dataWithSuggestedChanges);
    const {id} = element;

    if(isNewElement) {
      // Founds collection (fields, sections, groups) and embed new element to the end
      dataClone[collectionName] = {
        ...dataClone[collectionName],
        [id]: element,
      };
    } else {
      dataClone[collectionName][id] = element;
    }
    console.log(dataClone);
    return dataClone;
  };

  const handleElementChangesSave = () => {
    //TODO also add this changes to dform in redux. Local state will be in sync with redux store
    // with only difference that local changes will have applied suggested changes
    setIsModuleEditComponentVisible(false);
    setElementWithSuggestedChanges(null);
    setFakeReduxData(dataWithSuggestedChanges)
  };

  const handleElementChangesCancel = () => {
    setElementWithSuggestedChanges(null);
    setIsModuleEditComponentVisible(false);

    //TODO update local state with data from redux
    setDataWithSuggestedChanges(fakeReduxData);
  };

  const handleElementChange = (elementData) => {
    setElementWithSuggestedChanges(elementData)
  };

  useEffect(() => {
    if(elementWithSuggestedChanges !== null) {
      setDataWithSuggestedChanges(embedSuggestedChanges());
    }
  }, [elementWithSuggestedChanges]);

  useEffect(() => {
    setDataWithSuggestedChanges(fakeReduxData);
  }, [fakeReduxData]);

  return (
    <div className="d-flex">
      <ContextTemplate contextTitle="Applications" contextName="dForm » introduction">
        <DForm
          data={dataWithSuggestedChanges}
          isConfigurable={isConfigurable}
          onElementClick={handleSelectElementForEdit}
          onSectionCreate={handleSectionCreate}
          onGroupCreate={handleGroupCreate}
          onFieldCreate={handleFieldCreate}
        />
      </ContextTemplate>
      {isModuleEditComponentVisible && (
        <ContextFeatureTemplate contextFeatureTitle="dForm">
          <DFormElementEdit
            element={elementWithSuggestedChanges}
            onElementChange={handleElementChange}
            onElementChangesSave={handleElementChangesSave}
            onElementChangesCancel={handleElementChangesCancel}
          />
        </ContextFeatureTemplate>
      )}
    </div>
  )
};

export default Applications;
