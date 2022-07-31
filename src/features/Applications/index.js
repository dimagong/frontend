import React, { useEffect, useState } from "react";

import ContextTemplate from "components/ContextTemplate";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import DForm from "components/DForm";
import DFormElementEdit from "./Components/DFormElementEdit";

import { makeid } from "../../components/FormCreate/utils";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";

import { useSelector } from "react-redux";
import { selectProfile } from "../../app/selectors";

import {
  INITIAL_FIELD_DATA,
  INITIAL_GROUP_DATA,
  INITIAL_SECTION_DATA,
  ELEMENT_TYPES,
  FIELD_COMMON_PROPERTIES,
  FIELD_SPECIFIC_PROPERTIES,
  FIELD_INITIAL_SPECIFIC_PROPERTIES,
  FIELD_TYPES,
  FIELD_SPECIFIC_UI_STYLE_PROPERTIES,
  APPLICATION_PAGES,
} from "./constants";
import { elementValidationSchemas, MSPropertyValidationSchema } from "./validationSchemas";

import "./styles.scss";
import { Button, TabContent, TabPane } from "reactstrap";
import CustomTabs from "../../components/Tabs";
import NewApplicationInitForm from "./Components/NewApplicationInitForm";
import ApplicationDescription from "./Components/ApplicationDescription";
import ElementsReorderComponent from "./Components/ElementsReorderComponent";

import { useApplicationCreateMutation } from "./applicationQueries";

const data = {
  type: "application",
  name: "Dform name",
  description: "description",
  isPrivate: false,
  organization: {
    id: 1,
    corporation_id: 1,
    name: "ValidPath",
    created_at: "2022-03-28T17:51:44.000000Z",
    updated_at: "2022-05-27T16:29:20.000000Z",
    intro_text: "<p>ValidPath intro text</p>",
    intro_title: "ValidPath intro",
    type: "network",
  },
  sectionsOrder: ["First section"],
  sections: {
    "First section": {
      id: "First section",
      name: "First section",
      isProtected: false,
      isDisabled: false,
      isHidden: false,
      isAlreadyViewed: false, // Need it to mark section with tick when it have 0 fields that needs to be filled
      relatedGroups: ["Group one", "Second group"],
      conditions: "",
    },
  },
  groups: {
    "Group one": {
      name: "Group one",
      id: "Group one",
      isProtected: false,
      relatedFields: ["1", "2", "3"],
    },
    "Second group": {
      name: "Second group",
      id: "Second group",
      isProtected: false,
      relatedFields: ["4"],
    },
  },
  fields: {
    1: {
      id: "1",
      isNotMasterSchemaRelated: true,
      type: "text",
      title: "Some text",
      isRequired: true,
      classes: "col-md-12",
      isLabelShowing: true,
    },
    2: {
      id: "2",

      type: "textarea",
      title: "Your biography",
      isRequired: true,
      classes: "col-md-12",
      isLabelShowing: true,
    },
    3: {
      id: "3",

      type: "select",
      title: "Select your country",
      isLabelShowing: true,
      classes: "col-md-12",
    },
    4: {
      id: "4",

      type: "text",
      title: "Email of your best friend",
      isLabelShowing: true,
      classes: "col-md-12",
    },
  },
  errors: {},
};

//TODO fix bug with MSProperty select. It doesn't clear it's value when switching to different elements
// because of internal behavior of component

const Applications = ({ isCreate }) => {
  const [fakeReduxData, setFakeReduxData] = useState(data);

  const [selectedPage, setSelectedPage] = useState(isCreate ? APPLICATION_PAGES.DESCRIPTION : APPLICATION_PAGES.DESIGN);
  const [isModuleEditComponentVisible, setIsModuleEditComponentVisible] = useState(false);
  const [elementWithSuggestedChanges, setElementWithSuggestedChanges] = useState(null);
  const [dataWithSuggestedChanges, setDataWithSuggestedChanges] = useState(cloneDeep(fakeReduxData));
  const [isDFormInitialized, setIsDFormInitialized] = useState(false);

  const userProfile = useSelector(selectProfile);

  const createApplication = useApplicationCreateMutation({
    onError: () => {
      console.log("test");
    },
  });

  const getElementCollectionName = (element) => {
    let elementCollectionName;

    switch (true) {
      case element.hasOwnProperty("relatedGroups"):
        elementCollectionName = "sections";
        break;
      case element.hasOwnProperty("relatedFields"):
        elementCollectionName = "groups";
        break;
      default:
        elementCollectionName = "fields";
        break;
    }

    return elementCollectionName;
  };

  const handleSelectElementForEdit = (element, elementType) => {
    if (elementWithSuggestedChanges?.edited) {
      if (!window.confirm(`Are you sure you want to select another element for edit without saving?`)) {
        return;
      }
    }
    //TODO update local state with data from redux
    setDataWithSuggestedChanges(fakeReduxData);

    // We take element from "backend" data, but also spread element that we receive
    // to save some system information that we pass to element in onClick handler such as groupId or sectionId, etc.
    const collectionName = getElementCollectionName(element);
    const selectedElement = { ...element, ...fakeReduxData[collectionName][element.id] };

    setElementWithSuggestedChanges({ ...selectedElement, elementType });
    setIsModuleEditComponentVisible(true);
  };

  const getUniqNameForCollection = (collectionName, baseName) => {
    let tabIndex = 1;

    while (`${baseName} ${tabIndex}` in fakeReduxData[collectionName]) tabIndex++;

    return `${baseName} ${tabIndex}`;
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

    const dataToSave = embedSuggestedChanges(newSectionData, true);

    dataToSave.sectionsOrder = [...dataToSave.sectionsOrder, newSectionData.id];

    setFakeReduxData(dataToSave);

    // setElementWithSuggestedChanges({...newSectionData});
    // setIsModuleEditComponentVisible(true);

    //TODO refactor this and all uses of isNew if creation wouldn't need approve by click "create"
    // Remove in case if approve will be needed
    // handleElementChangesSave();
  };

  const handleGroupCreate = (sectionId) => {
    const groupName = getUniqNameForCollection("groups", "Group");

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
      ...FIELD_INITIAL_SPECIFIC_PROPERTIES[FIELD_TYPES.text],
      ...FIELD_SPECIFIC_UI_STYLE_PROPERTIES[FIELD_TYPES.text],
      id: makeid(9),
      isNew: true,
    };

    const dataToSave = embedSuggestedChanges(newFieldData, true);

    // Add field to group where it was created
    dataToSave.groups[group].relatedFields = [...dataToSave.groups[group].relatedFields, newFieldData.id];

    setFakeReduxData(dataToSave);
  };

  // While we aim for using old API and redux that handle it, we can't save parts of data separately
  // so we need to embed our new changes to the rest of data before save
  const embedSuggestedChanges = (element = elementWithSuggestedChanges, isNewElement) => {
    const collectionName = getElementCollectionName(element);
    const dataClone = cloneDeep(dataWithSuggestedChanges);
    const { id } = element;

    console.log("ELEMENT", element);

    if (isNewElement) {
      // Founds collection (fields, sections, groups) and embed new element to the end
      dataClone[collectionName] = {
        ...dataClone[collectionName],
        [id]: element,
      };
    } else {
      dataClone[collectionName][id] = { ...element, edited: false };
    }

    return dataClone;
  };

  const removeItemFormArrayByValue = (array, item) => {
    const index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  };

  // ELEMENT DELETION WILL BE FULLY REFACTORED AFTER REACT-QUERY INTEGRATION
  const handleElementDelete = (element) => {
    if (!window.confirm(`Are you sure you want to delete this element?`)) {
      return;
    }

    const dataClone = cloneDeep(dataWithSuggestedChanges);

    switch (element.elementType) {
      case ELEMENT_TYPES.section:
        handleSectionDelete(element, dataClone);
        break;
      case ELEMENT_TYPES.group:
        handleGroupDelete(element, dataClone);
        break;
      case ELEMENT_TYPES.field:
        handleFieldDelete(element, dataClone);
        break;
      default:
        console.error("cannot delete element with type " + element.elementType);
    }

    setIsModuleEditComponentVisible(false);
    setElementWithSuggestedChanges(null);
    setFakeReduxData(dataClone);
  };

  const handleSectionDelete = (section, data) => {
    section.relatedGroups.map((groupId) => handleGroupDelete(data.groups[groupId], data));

    data.sectionsOrder = removeItemFormArrayByValue(data.sectionsOrder, section.id);

    delete data.sections[section.id];
  };

  const handleGroupDelete = (group, data) => {
    const groupSection = Object.values(data.sections).filter((section) => section.relatedGroups.includes(group.id))[0];
    data.sections[groupSection.id].relatedGroups = removeItemFormArrayByValue(
      data.sections[groupSection.id].relatedGroups,
      group.id
    );

    group.relatedFields.map((fieldId) => delete data.fields[fieldId]);

    delete data.groups[group.id];
  };

  const handleFieldDelete = (field, data) => {
    const fieldGroup = Object.values(data.groups).filter((group) => group.relatedFields.includes(String(field.id)))[0];
    console.log(fieldGroup?.id, field?.id);

    data.groups[fieldGroup.id].relatedFields = removeItemFormArrayByValue(
      data.groups[fieldGroup.id].relatedFields,
      field.id
    );

    delete data.fields[field.id];
  };

  const validateElement = (element) => {
    const elementValidationSchema = elementValidationSchemas[element.elementType];

    if (!elementValidationSchema) {
      console.error(`There is no validation schema for ${element.elementType} element`);

      return null;
    }

    try {
      elementValidationSchema.validateSync(element, {
        context: { application: dataWithSuggestedChanges },
      });

      if (element.elementType === ELEMENT_TYPES.field) {
        const masterSchemaUsedPropertiesList = Object.values(dataWithSuggestedChanges.fields).reduce((acc, curr) => {
          if (curr.id !== element.id && curr.masterSchemaPropertyId) {
            acc.push(curr.masterSchemaPropertyId);
          }

          return acc;
        }, []);

        MSPropertyValidationSchema.validateSync(element.masterSchemaPropertyId, {
          context: { masterSchemaUsedPropertiesList },
        });
      }
    } catch (validationError) {
      console.log("error", validationError);
      return { isElementValid: false, errors: validationError };
    }
    console.log("here");

    return { isElementValid: true };
  };

  const handleElementParentChange = (
    elementId,
    oldParentId,
    newParentId,
    parentCollection,
    elementIdList,
    elementParentIdName
  ) => {
    if (oldParentId === newParentId) return;

    const dataClone = cloneDeep(dataWithSuggestedChanges);

    dataClone[parentCollection][oldParentId][elementIdList] = removeItemFormArrayByValue(
      dataClone[parentCollection][oldParentId][elementIdList],
      elementId
    );
    dataClone[parentCollection][newParentId][elementIdList].push(elementId);

    setDataWithSuggestedChanges(dataClone);
    setElementWithSuggestedChanges({
      ...elementWithSuggestedChanges,
      [elementParentIdName]: newParentId,
      edited: true,
    });
  };

  const handleFieldGroupChange = (fieldId, oldGroupId, newGroupId) => {
    handleElementParentChange(fieldId, oldGroupId, newGroupId, "groups", "relatedFields", "groupId");
  };

  const handleGroupSectionChange = (groupId, oldSectionId, newSectionId) => {
    handleElementParentChange(groupId, oldSectionId, newSectionId, "sections", "relatedGroups", "sectionId");
  };

  // On save extracts all necessary props from field object. Prevent from saving properties that are specific
  // to another type of field, e.g. options of select.
  // Do not extract those before user save, because he might want to save his changes to specific property
  // and come back to that field type
  const extractPropsFromField = (field) => {
    const requiredProps = [...FIELD_COMMON_PROPERTIES, ...FIELD_SPECIFIC_PROPERTIES[field.type]];

    return requiredProps.reduce((acc, property) => {
      acc[property] = field[property];

      return acc;
    }, {});
  };

  const handleElementChangesSave = () => {
    //TODO also add this changes to dform in redux. Local state will be in sync with redux store
    // with only difference that local changes will have applied suggested changes

    const response = validateElement(elementWithSuggestedChanges);

    const { isElementValid, errors } = response;

    if (isElementValid) {
      // TODO REMOVE ELEMENT ERRORS

      setIsModuleEditComponentVisible(false);
      setElementWithSuggestedChanges(null);

      if (elementWithSuggestedChanges.elementType === ELEMENT_TYPES.field) {
        setFakeReduxData(embedSuggestedChanges(extractPropsFromField(elementWithSuggestedChanges)));
      } else {
        setFakeReduxData(embedSuggestedChanges());
      }
    } else {
      //Todo change it in future to displaying errors under the elements where its occur
      toast.error(errors.message);
    }
  };

  const handleElementChangesCancel = () => {
    setElementWithSuggestedChanges(null);
    setIsModuleEditComponentVisible(false);

    //TODO update local state with data from redux
    setDataWithSuggestedChanges(fakeReduxData);
  };

  const handleElementChange = (elementData) => {
    setElementWithSuggestedChanges({ ...elementData, edited: true });
  };

  const handleApplicationDescriptionChange = (descriptionKey, value) => {
    setDataWithSuggestedChanges({ ...dataWithSuggestedChanges, [descriptionKey]: value });
  };

  const handlePageChange = (page) => {
    if (elementWithSuggestedChanges?.edited) {
      if (!window.confirm(`Are you sure you want to select another element for edit without saving?`)) {
        return;
      }
    }
    handleElementChangesCancel();
    setSelectedPage(page);
  };

  const handleDFormInitialize = () => {
    setIsDFormInitialized(true);
  };

  const handleSectionReorder = (result) => {
    const dataClone = cloneDeep(dataWithSuggestedChanges);

    const itemToMove = dataClone.sectionsOrder.splice(result.source.index, 1)[0];

    dataClone.sectionsOrder.splice(result.destination.index, 0, itemToMove);

    setDataWithSuggestedChanges(dataClone);
    setFakeReduxData(dataClone);
  };

  const handleGroupReorder = (result) => {
    const dataClone = cloneDeep(dataWithSuggestedChanges);

    const itemToMove = dataClone.sections[result.parentItem.id].relatedGroups.splice(result.source.index, 1)[0];

    dataClone.sections[result.parentItem.id].relatedGroups.splice(result.destination.index, 0, itemToMove);

    setDataWithSuggestedChanges(dataClone);
  };

  const handleFieldReorder = (result) => {
    const dataClone = cloneDeep(dataWithSuggestedChanges);

    const itemToMove = dataClone.groups[result.parentItem.id].relatedFields.splice(result.source.index, 1)[0];

    dataClone.groups[result.parentItem.id].relatedFields.splice(result.destination.index, 0, itemToMove);

    setDataWithSuggestedChanges(dataClone);
  };

  const handleReorder = (result) => {
    switch (result.type) {
      case ELEMENT_TYPES.section:
        handleSectionReorder(result);
        break;
      case ELEMENT_TYPES.group:
        handleGroupReorder(result);
        break;
      case ELEMENT_TYPES.field:
        handleFieldReorder(result);
        break;
    }
  };

  const handleApplicationCreate = () => {
    // Errors object spread just to not to pass it into mutation
    const { name, description, isPrivate, type, errors, organization, ...schema } = dataWithSuggestedChanges;

    createApplication.mutate({
      name,
      description,
      isPrivate,
      organization,
      schema,
    });
  };

  useEffect(() => {
    if (elementWithSuggestedChanges !== null) {
      setDataWithSuggestedChanges(embedSuggestedChanges());
    }
  }, [elementWithSuggestedChanges]);

  useEffect(() => {
    setDataWithSuggestedChanges(fakeReduxData);
  }, [fakeReduxData]);

  if (isCreate && !isDFormInitialized) {
    return <NewApplicationInitForm userId={userProfile?.id} onDFormInitialize={handleDFormInitialize} />;
  }

  return (
    <div className="application d-flex">
      <ContextTemplate contextTitle="Application" contextName="dForm » introduction">
        <CustomTabs
          active={selectedPage}
          onChange={handlePageChange}
          tabs={Object.values(APPLICATION_PAGES)}
          className="mb-3"
        />
        <TabContent activeTab={selectedPage}>
          <TabPane tabId={APPLICATION_PAGES.DESCRIPTION}>
            <ApplicationDescription onChange={handleApplicationDescriptionChange} />
          </TabPane>
          <TabPane tabId={APPLICATION_PAGES.DESIGN}>
            <DForm
              data={dataWithSuggestedChanges}
              isConfigurable={true}
              onElementClick={handleSelectElementForEdit}
              onSectionCreate={handleSectionCreate}
              onGroupCreate={handleGroupCreate}
              onFieldCreate={handleFieldCreate}
            />
          </TabPane>
          <TabPane tabId={APPLICATION_PAGES.REORDER}>
            <ElementsReorderComponent onReorder={handleReorder} applicationData={dataWithSuggestedChanges} />
          </TabPane>
        </TabContent>

        <div style={{ paddingLeft: "35px", paddingRight: "35px" }}>
          <div className={"application_delimiter"} />
          {selectedPage !== APPLICATION_PAGES.TEST_MODE && (
            <div className="d-flex justify-content-between ">
              <Button className={"button button-cancel"}>Cancel</Button>

              <Button color={"primary"} className={"button button-success"} onClick={handleApplicationCreate}>
                {isCreate ? "Create" : "Save"}
              </Button>
            </div>
          )}
        </div>
      </ContextTemplate>
      {isModuleEditComponentVisible && (
        <ContextFeatureTemplate contextFeatureTitle="dForm">
          <DFormElementEdit
            data={dataWithSuggestedChanges}
            element={elementWithSuggestedChanges}
            onElementChange={handleElementChange}
            onElementDelete={handleElementDelete}
            onElementChangesSave={handleElementChangesSave}
            onElementChangesCancel={handleElementChangesCancel}
            organization={dataWithSuggestedChanges.organization}
            onFieldGroupChange={handleFieldGroupChange}
            onGroupSectionChange={handleGroupSectionChange}
          />
        </ContextFeatureTemplate>
      )}
    </div>
  );
};

export default Applications;
