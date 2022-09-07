import "./styles.scss";

import { v4 } from "uuid";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TabContent, TabPane } from "reactstrap";

import DForm from "components/DForm";
import CustomTabs from "components/Tabs";
import ContextTemplate from "components/ContextTemplate";
import { ELEMENT_TYPES } from "components/DForm/constants";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import appSlice from "app/slices/appSlice";
import onboardingSlice from "app/slices/onboardingSlice";
import { selectProfile, selectdForm } from "app/selectors";

import {
  APPLICATION_PAGES,
  INITIAL_GROUP_DATA,
  INITIAL_SECTION_DATA,
  INITIAL_APPLICATION_DATA,
  FIELDS_NOT_RELATED_TO_MASTER_SCHEMA,
} from "./constants";
import {
  useApplicationTemplateCreateMutation,
  useApplicationTemplate,
  useApplicationTemplateUpdateMutation,
} from "./applicationQueries";
import { DFormFieldModel } from "./fieldModel";
import DFormElementEdit from "./Components/DFormElementEdit";
import NewApplicationInitForm from "./Components/NewApplicationInitForm";
import ApplicationDescription from "./Components/ApplicationDescription";
import ElementsReorderComponent from "./Components/ElementsReorderComponent";
import { applicationSubmitValidation } from "./applicationSubmitValidation";
import { elementValidationSchemas, MSPropertyValidationSchema } from "./validationSchemas";

const { setContext } = appSlice.actions;
const { setdForm } = onboardingSlice.actions;

//TODO fix bug with MSProperty select. It doesn't clear it's value when switching to different elements
// because of internal behavior of component

const validateDescriptionDesignMode = (validData) => {
  try {
    applicationSubmitValidation.validateSync(validData, { abortEarly: false });
  } catch (validationError) {
    console.log("error", validationError);
    return { isValid: false, errors: validationError };
  }
  return { isValid: true };
};

const mutateApplication = (applicationData, mutation) => {
  const { isValid, errors: errValidation } = validateDescriptionDesignMode(applicationData);

  if (isValid) {
    const { name, description, isPrivate, type, errors, organization, ...schema } = applicationData;

    return mutation.mutateAsync({
      name,
      description,
      is_private: isPrivate,
      groups: [{ group_id: organization.id, type: organization.type }],
      schema,
    });
  } else {
    toast.error(errValidation.message);
  }
};

const Applications = ({ isCreate }) => {
  const dispatch = useDispatch();

  const userProfile = useSelector(selectProfile);
  const selectedDForm = useSelector(selectdForm);

  const [applicationData, setApplicationData] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const createApplicationMutation = useApplicationTemplateCreateMutation({
    onSuccess: (data) => {
      dispatch(setdForm(data));
      dispatch(setContext("dForm"));
      toast.success("Application created");
    },
    onError: () => {
      //TODO handle error
      console.error("application create error");
    },
  });

  const updateApplicationMutation = useApplicationTemplateUpdateMutation(
    { applicationId: selectedDForm?.id },
    {
      onSuccess: (data) => {
        const { groups, schema, is_private, ...rest } = data;

        const applicationData = {
          organization: groups[0],
          isPrivate: is_private,
          ...schema,
          ...rest,
        };

        setApplicationData(applicationData);
        toast.success("Application saved");
      },
    }
  );

  const application = useApplicationTemplate(
    { applicationId: selectedDForm?.id },
    {
      onSuccess: (data) => {
        const { groups, schema, is_private, ...rest } = data;

        const applicationData = {
          organization: groups[0],
          isPrivate: is_private,
          ...schema,
          ...rest,
        };

        setApplicationData(applicationData);
      },
      enabled: Boolean(selectedDForm?.id) && !isCreate && !createApplicationMutation.isLoading,
      refetchOnWindowFocus: false,
    }
  );

  const [isDFormInitialized, setIsDFormInitialized] = useState(false);
  const [isModuleEditComponentVisible, setIsModuleEditComponentVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState(isCreate ? APPLICATION_PAGES.DESCRIPTION : APPLICATION_PAGES.DESIGN);

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
    if (selectedElement?.edited) {
      if (!window.confirm(`Are you sure you want to select another element for edit without saving?`)) {
        return;
      }
    }
    //TODO update local state with data from redux

    // We take element from "backend" data, but also spread element that we receive
    // to save some system information that we pass to element in onClick handler such as groupId or sectionId, etc.
    const collectionName = getElementCollectionName(element);
    const newSelectedElement = { ...element, ...applicationData[collectionName][element.id] };

    setSelectedElement({ ...newSelectedElement, elementType });
    setIsModuleEditComponentVisible(true);
  };

  const getUniqNameForCollection = (collectionName, baseName) => {
    let tabIndex = 1;

    if (applicationData[collectionName]) {
      const instancesNames = Object.values(applicationData[collectionName]).map((instance) => instance.name);
      while (instancesNames.includes(`${baseName} ${tabIndex}`)) tabIndex++;
    }

    return `${baseName} ${tabIndex}`;
  };

  const handleSectionCreate = () => {
    const sectionName = getUniqNameForCollection("sections", "Tab");

    const newSectionData = {
      ...INITIAL_SECTION_DATA,
      id: v4(),
      name: sectionName,
      elementType: "section",
      // ToDo: Handle refactoring situation with isNew
      // isNew: true,
    };

    const dataToSave = embedSuggestedChanges(newSectionData, true);

    dataToSave.sectionsOrder = [...(dataToSave.sectionsOrder || []), newSectionData.id];

    setApplicationData(dataToSave);
  };

  const handleGroupCreate = (sectionId) => {
    const groupName = getUniqNameForCollection("groups", "Group");

    const newGroupData = {
      ...INITIAL_GROUP_DATA,
      id: v4(),
      name: groupName,
      // ToDo: Handle refactoring situation with isNew
      // isNew: true,
    };

    const dataToSave = embedSuggestedChanges(newGroupData, true);

    // Add group to section where it was created
    dataToSave.sections[sectionId].relatedGroups = [...dataToSave.sections[sectionId].relatedGroups, newGroupData.id];

    setApplicationData(dataToSave);
  };

  const handleFieldCreate = (groupId) => {
    const newField = DFormFieldModel.create(groupId);
    // const newFieldData = {
    //   ...INITIAL_FIELD_DATA,
    //   id: v4(),
    //   // ToDo: Handle refactoring situation with isNew
    //   // isNew: true,
    // };

    const dataToSave = embedSuggestedChanges(newField, true);

    // Add field to group where it was created
    dataToSave.groups[groupId].relatedFields = [...dataToSave.groups[groupId].relatedFields, newField.id];

    setApplicationData(dataToSave);
  };

  // While we aim for using old API and redux that handle it, we can't save parts of data separately
  // so, we need to embed our new changes to the rest of data before save
  const embedSuggestedChanges = (element, isNewElement = false) => {
    const collectionName = getElementCollectionName(element);
    const dataClone = cloneDeep(applicationData);
    const { id } = element;

    if (isNewElement) {
      // Founds collection (fields, sections, groups) and embed new element to the end
      dataClone[collectionName] = { ...dataClone[collectionName], [id]: element };
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

  const handleElementDelete = (element) => {
    if (!window.confirm(`Are you sure you want to delete this element?`)) {
      return;
    }

    const dataClone = cloneDeep(applicationData);

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
        throw new Error(`Unexpected: do not support element type: ${element.elementType}`);
    }

    setIsModuleEditComponentVisible(false);
    setSelectedElement(null);
    setApplicationData(dataClone);
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

    data.groups[fieldGroup.id].relatedFields = removeItemFormArrayByValue(
      data.groups[fieldGroup.id].relatedFields,
      field.id
    );

    delete data.fields[field.id];
  };

  const validateElement = (element) => {
    let elementValidationSchema = elementValidationSchemas[element.elementType];

    if (element.elementType === ELEMENT_TYPES.field) {
      //get validation schema for field depending on type
      elementValidationSchema = elementValidationSchema[element.type];
    }

    if (!elementValidationSchema) {
      throw new Error(`There is no validation schema for ${element.elementType} element`);
    }

    try {
      elementValidationSchema.validateSync(element, { context: { application: applicationData } });

      if (element.elementType === ELEMENT_TYPES.field && !FIELDS_NOT_RELATED_TO_MASTER_SCHEMA.includes(element.type)) {
        const masterSchemaUsedPropertiesList = Object.values(applicationData.fields).reduce((acc, curr) => {
          if (curr.id !== element.id && curr.masterSchemaFieldId) {
            acc.push(curr.masterSchemaFieldId);
          }

          return acc;
        }, []);

        MSPropertyValidationSchema.validateSync(element.masterSchemaFieldId, {
          context: { masterSchemaUsedPropertiesList },
        });
      }
    } catch (validationError) {
      console.log("error", validationError);
      return { isElementValid: false, errors: validationError };
    }

    return { isElementValid: true };
  };

  const handleElementParentChange = (params) => {
    const { elementId, oldParentId, newParentId, parentCollection, elementIdList, elementParentIdName } = params;
    if (oldParentId === newParentId) return;

    const dataClone = cloneDeep(applicationData);

    dataClone[parentCollection][oldParentId][elementIdList] = removeItemFormArrayByValue(
      dataClone[parentCollection][oldParentId][elementIdList],
      elementId
    );
    dataClone[parentCollection][newParentId][elementIdList].push(elementId);

    setApplicationData(dataClone);
    setSelectedElement({ ...selectedElement, [elementParentIdName]: newParentId, edited: true });
  };

  const handleFieldGroupChange = (fieldId, oldGroupId, newGroupId) =>
    handleElementParentChange({
      elementId: fieldId,
      oldParentId: oldGroupId,
      newParentId: newGroupId,
      parentCollection: "groups",
      elementIdList: "relatedFields",
      elementParentIdName: "groupId",
    });

  const handleGroupSectionChange = (groupId, oldSectionId, newSectionId) =>
    handleElementParentChange({
      elementId: groupId,
      oldParentId: oldSectionId,
      newParentId: newSectionId,
      parentCollection: "sections",
      elementIdList: "relatedGroups",
      elementParentIdName: "sectionId",
    });

  const handleElementChangesSave = () => {
    //TODO also add this changes to dform in redux. Local state will be in sync with redux store
    // with only difference that local changes will have applied suggested changes

    const { isElementValid, errors } = validateElement(selectedElement);

    if (isElementValid) {
      // TODO REMOVE ELEMENT ERRORS

      setIsModuleEditComponentVisible(false);
      setSelectedElement(null);

      let dataToSave;

      if (selectedElement.elementType === ELEMENT_TYPES.field) {
        dataToSave = embedSuggestedChanges(selectedElement);
      } else {
        dataToSave = embedSuggestedChanges(selectedElement);
      }

      setApplicationData(dataToSave);

      const mutation = isCreate ? createApplicationMutation : updateApplicationMutation;
      mutateApplication(dataToSave, mutation);
    } else {
      //Todo change it in future to displaying errors under the elements where its occur
      toast.error(errors.message);
    }
  };

  const handleElementChangesCancel = () => {
    setSelectedElement(null);
    setIsModuleEditComponentVisible(false);
  };

  // ToDo: remove edited
  const handleElementChange = (elementData) => {
    let element;
    if (elementData.elementType === ELEMENT_TYPES.field) {
      element = DFormFieldModel.from(elementData);
      element.edited = true;
    } else {
      element = { ...elementData, edited: true };
    }

    const dataToSave = embedSuggestedChanges(element);

    setSelectedElement(element);
    setApplicationData(dataToSave);
  };

  const handleApplicationDescriptionChange = (descriptionKey, value) => {
    setApplicationData({ ...applicationData, [descriptionKey]: value });
  };

  const handlePageChange = (page) => {
    if (selectedElement?.edited) {
      if (!window.confirm(`Are you sure you want to select another element for edit without saving?`)) {
        return;
      }
    }
    handleElementChangesCancel();
    setSelectedPage(page);
  };

  const handleDFormInitialize = (organization) => {
    const data = { ...INITIAL_APPLICATION_DATA, organization };

    setApplicationData(data);
    setIsDFormInitialized(true);
  };

  const handleSectionReorder = (result) => {
    const dataClone = cloneDeep(applicationData);

    const itemToMove = dataClone.sectionsOrder.splice(result.source.index, 1)[0];

    dataClone.sectionsOrder.splice(result.destination.index, 0, itemToMove);

    setApplicationData(dataClone);
  };

  const handleGroupReorder = (result) => {
    const dataClone = cloneDeep(applicationData);

    const itemToMove = dataClone.sections[result.parentItem.id].relatedGroups.splice(result.source.index, 1)[0];

    dataClone.sections[result.parentItem.id].relatedGroups.splice(result.destination.index, 0, itemToMove);

    setApplicationData(dataClone);
  };

  const handleFieldReorder = (result) => {
    const dataClone = cloneDeep(applicationData);

    const itemToMove = dataClone.groups[result.parentItem.id].relatedFields.splice(result.source.index, 1)[0];

    dataClone.groups[result.parentItem.id].relatedFields.splice(result.destination.index, 0, itemToMove);

    setApplicationData(dataClone);
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
      default:
        throw new Error(`Unexpected element type: ${result.type}`);
    }
  };

  const handleApplicationMutation = () => {
    // ToDo: validate here too
    const mutation = isCreate ? createApplicationMutation : updateApplicationMutation;

    mutateApplication(applicationData, mutation);
  };

  if ((!isCreate && !applicationData) || application.isLoading) {
    return <div>Loading...</div>;
  }

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
            <ApplicationDescription
              name={applicationData.name}
              description={applicationData.description}
              isPrivate={applicationData.isPrivate}
              organization={applicationData.organization}
              onChange={handleApplicationDescriptionChange}
            />
          </TabPane>
          <TabPane tabId={APPLICATION_PAGES.DESIGN}>
            <DForm
              isConfigurable={true}
              data={applicationData}
              selectedElement={selectedElement}
              onElementClick={handleSelectElementForEdit}
              onSectionCreate={handleSectionCreate}
              onGroupCreate={handleGroupCreate}
              onFieldCreate={handleFieldCreate}
            />
          </TabPane>
          <TabPane tabId={APPLICATION_PAGES.REORDER}>
            <ElementsReorderComponent onReorder={handleReorder} applicationData={applicationData} />
          </TabPane>
        </TabContent>

        <div style={{ paddingLeft: "35px", paddingRight: "35px" }}>
          <div className="application_delimiter" />

          <div className="d-flex justify-content-center">
            <Button
              color="primary"
              className="button button-success"
              disabled={createApplicationMutation.isLoading || updateApplicationMutation.isLoading}
              onClick={handleApplicationMutation}
            >
              {isCreate ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </ContextTemplate>

      {isModuleEditComponentVisible ? (
        <ContextFeatureTemplate contextFeatureTitle="dForm">
          <DFormElementEdit
            data={applicationData}
            element={selectedElement}
            organization={applicationData.organization}
            onElementChange={handleElementChange}
            onElementDelete={handleElementDelete}
            onElementChangesSave={handleElementChangesSave}
            onElementChangesCancel={handleElementChangesCancel}
            onFieldGroupChange={handleFieldGroupChange}
            onGroupSectionChange={handleGroupSectionChange}
          />
        </ContextFeatureTemplate>
      ) : null}
    </div>
  );
};

export default Applications;
