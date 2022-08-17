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
import { useDispatch } from "react-redux";

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
  INITIAL_APPLICATION_DATA,
} from "./constants";
import { elementValidationSchemas, MSPropertyValidationSchema } from "./validationSchemas";
import { decriptionValidationSchema, designModeValidationSchema } from "./validationDescription";

import "./styles.scss";
import { Button, TabContent, TabPane } from "reactstrap";
import CustomTabs from "../../components/Tabs";
import NewApplicationInitForm from "./Components/NewApplicationInitForm";
import ApplicationDescription from "./Components/ApplicationDescription";
import ElementsReorderComponent from "./Components/ElementsReorderComponent";
import { selectdForm } from "../../app/selectors";
import {
  useApplicationTemplateCreateMutation,
  useApplicationTemplate,
  useApplicationTemplateUpdateMutation,
} from "./applicationQueries";
import appSlice from "../../app/slices/appSlice";
import onboardingSlice from "../../app/slices/onboardingSlice";

const { setdForm } = onboardingSlice.actions;

const { setContext } = appSlice.actions;

//TODO fix bug with MSProperty select. It doesn't clear it's value when switching to different elements
// because of internal behavior of component

const checkMinMaxField = (elem) => {
  if (elem.elementType === ELEMENT_TYPES.field && "minimum" in elem) {
    if (elem.minimum === "") {
      elem.minimum = undefined;
    }
    if (elem.maximum === "") {
      elem.maximum = undefined;
    }
  }
  if (elem.elementType === ELEMENT_TYPES.field && "minLength" in elem) {
    if (elem.minLength === "") {
      elem.minLength = undefined;
    }
    if (elem.maxLength === "") {
      elem.maxLength = undefined;
    }
  }
  return elem;
};

const Applications = ({ isCreate }) => {
  const dispatch = useDispatch();

  const userProfile = useSelector(selectProfile);
  const selectedDForm = useSelector(selectdForm);

  const [applicationData, setApplicationData] = useState(null);

  const createApplication = useApplicationTemplateCreateMutation({
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

  const updateApplication = useApplicationTemplateUpdateMutation(
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

        setDataWithSuggestedChanges(applicationData);
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

        setDataWithSuggestedChanges(applicationData);
        setApplicationData(applicationData);
      },
      enabled: Boolean(selectedDForm?.id) && !isCreate && !createApplication.isLoading,
      refetchOnWindowFocus: false, // In case of update it replace dataWithSuggestedChanges and that cause data loss
    }
  );

  const [selectedPage, setSelectedPage] = useState(isCreate ? APPLICATION_PAGES.DESCRIPTION : APPLICATION_PAGES.DESIGN);
  const [isModuleEditComponentVisible, setIsModuleEditComponentVisible] = useState(false);
  const [elementWithSuggestedChanges, setElementWithSuggestedChanges] = useState(null);
  const [dataWithSuggestedChanges, setDataWithSuggestedChanges] = useState(cloneDeep(applicationData));
  const [isDFormInitialized, setIsDFormInitialized] = useState(false);

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
    setDataWithSuggestedChanges(applicationData);

    // We take element from "backend" data, but also spread element that we receive
    // to save some system information that we pass to element in onClick handler such as groupId or sectionId, etc.
    const collectionName = getElementCollectionName(element);
    const selectedElement = { ...element, ...applicationData[collectionName][element.id] };

    setElementWithSuggestedChanges({ ...selectedElement, elementType });
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
      id: makeid(9),
      name: sectionName,
      elementType: "section",
      // isNew: true,
    };

    const dataToSave = embedSuggestedChanges(newSectionData, true);

    dataToSave.sectionsOrder = [...(dataToSave.sectionsOrder || []), newSectionData.id];

    setApplicationData(dataToSave);

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
      id: makeid(9),
      name: groupName,
      isNew: true,
    };

    const dataToSave = embedSuggestedChanges(newGroupData, true);

    // Add group to section where it was created
    dataToSave.sections[sectionId].relatedGroups = [...dataToSave.sections[sectionId].relatedGroups, newGroupData.id];

    setApplicationData(dataToSave);
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

    setApplicationData(dataToSave);
  };

  // While we aim for using old API and redux that handle it, we can't save parts of data separately
  // so we need to embed our new changes to the rest of data before save
  const embedSuggestedChanges = (element = elementWithSuggestedChanges, isNewElement) => {
    const collectionName = getElementCollectionName(element);
    const dataClone = cloneDeep(dataWithSuggestedChanges);
    const { id } = element;

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
        setApplicationData(embedSuggestedChanges(extractPropsFromField(elementWithSuggestedChanges)));
      } else {
        setApplicationData(embedSuggestedChanges());
      }
    } else {
      //Todo change it in future to displaying errors under the elements where its occur
      toast.error(errors.message);
    }
  };

  const handleElementChangesCancel = () => {
    setElementWithSuggestedChanges(null);
    setIsModuleEditComponentVisible(false);
  };

  const handleElementChange = (elementData) => {
    const elem = checkMinMaxField(elementData);
    setElementWithSuggestedChanges({ ...elem, edited: true });
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

  const handleDFormInitialize = (organization) => {
    const data = {
      ...INITIAL_APPLICATION_DATA,
      organization,
    };

    setDataWithSuggestedChanges(data);
    setApplicationData(data);

    setIsDFormInitialized(true);
  };

  const handleSectionReorder = (result) => {
    const dataClone = cloneDeep(dataWithSuggestedChanges);

    const itemToMove = dataClone.sectionsOrder.splice(result.source.index, 1)[0];

    dataClone.sectionsOrder.splice(result.destination.index, 0, itemToMove);

    setDataWithSuggestedChanges(dataClone);
    setApplicationData(dataClone);
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

  const validateDescriptionDesignMode = (validData) => {
    try {
      decriptionValidationSchema.validateSync(validData);
      designModeValidationSchema.validateSync(validData);
    } catch (validationError) {
      console.log("error", validationError);
      return { isValid: false, errors: validationError };
    }
    return { isValid: true };
  };

  const handleApplicationMutation = () => {
    const { isValid, errors: errValidation } = validateDescriptionDesignMode(dataWithSuggestedChanges);
    if (isValid) {
      // Errors object spread just to not to pass it into mutation
      const { name, description, isPrivate, type, errors, organization, ...schema } = dataWithSuggestedChanges;

      const dataToSave = {
        name,
        description,
        is_private: isPrivate,
        groups: [
          {
            group_id: organization.id,
            type: organization.type,
          },
        ],
        schema,
      };

      if (isCreate) {
        createApplication.mutate(dataToSave);
      } else {
        updateApplication.mutate(dataToSave);
      }
    } else {
      console.log("error", errValidation);
      toast.error(errValidation.message);
    }
  };

  useEffect(() => {
    setDataWithSuggestedChanges(applicationData);
  }, [applicationData]);

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
              onChange={handleApplicationDescriptionChange}
              name={dataWithSuggestedChanges.name}
              description={dataWithSuggestedChanges.description}
              isPrivate={dataWithSuggestedChanges.isPrivate}
              organization={dataWithSuggestedChanges.organization}
            />
          </TabPane>
          <TabPane tabId={APPLICATION_PAGES.DESIGN}>
            <DForm
              data={elementWithSuggestedChanges === null ? dataWithSuggestedChanges : embedSuggestedChanges()}
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

              <Button
                disabled={createApplication.isLoading || updateApplication.isLoading}
                color={"primary"}
                className={"button button-success"}
                onClick={handleApplicationMutation}
              >
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
