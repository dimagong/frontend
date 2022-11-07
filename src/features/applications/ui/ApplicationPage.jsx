import _ from "lodash";
import { v4 } from "uuid";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Row, Button, TabContent, TabPane } from "reactstrap";

import CustomTabs from "components/Tabs";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import { DFormElementTypes, DFormBlockTypes } from "features/dform/types";
import { DFormTemplateEditor } from "features/dform/ui/DFormTemplateEditor";

import { getCategoryAsOption } from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";

import { reorderArray } from "utility/reorderArray";

import { APPLICATION_PAGES, INITIAL_GROUP_DATA, INITIAL_SECTION_DATA } from "../constants";
import { DFormFieldModel } from "../fieldModel";
import DFormElementEdit from "../Components/DFormElementEdit";
import ElementsReorderComponent from "../Components/ElementsReorderComponent";
import { useApplicationTemplateQuery, useUpdateApplicationTemplateMutation } from "../data/applicationQueries";

import { ApplicationWrapper } from "./ApplicationWrapper";
import { mutateApplication } from "../data/mutateApplication";
import { ApplicationDescription } from "./ApplicationDescription";

import { useDFormTemplateCategoriesQuery } from "features/home/ContextSearch/Applications/categoryQueries";
import { parseSelectCategory } from "features/home/ContextSearch/Applications/utils/categoryConverter";

export const ApplicationPage = ({ applicationId }) => {
  const [applicationData, setApplicationData] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    if (selectedElement) {
      const type = `${selectedElement.elementType}s`;
      const updatedSelectedElement = applicationData[type][selectedElement.id];

      if (!_.isEqual(updatedSelectedElement, selectedElement)) {
        setSelectedElement(updatedSelectedElement);
      }
    }
  }, [applicationData]);

  const updateApplication = useUpdateApplicationTemplateMutation(
    { applicationId },
    { onSuccess: () => toast.success("Application saved") }
  );

  const application = useApplicationTemplateQuery(
    { applicationId },
    {
      onSuccess: (data) => {
        const { groups, schema, is_private, category_id, ...rest } = data;

        const applicationData = {
          organization: groups[0],
          categoryId: category_id,
          isPrivate: is_private,
          ...schema,
          ...rest,
        };

        setApplicationData(applicationData);
      },
      enabled: Boolean(applicationId),
      refetchOnWindowFocus: false,
    }
  );

  const [selectedPage, setSelectedPage] = useState(APPLICATION_PAGES.DESIGN);
  const [isModuleEditComponentVisible, setIsModuleEditComponentVisible] = useState(false);

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

  const handleFieldCreate = (groupId, fieldId = undefined) => {
    const newField = DFormFieldModel.create(groupId);
    // const newFieldData = {
    //   ...INITIAL_FIELD_DATA,
    //   id: v4(),
    //   // ToDo: Handle refactoring situation with isNew
    //   // isNew: true,
    // };

    const dataToSave = embedSuggestedChanges(newField, true);

    // Add field to group where it was created
    if (fieldId) {
      const fieldIndex = dataToSave.groups[groupId].relatedFields.indexOf(fieldId);
      dataToSave.groups[groupId].relatedFields.splice(fieldIndex + 1, 0, newField.id);
    } else {
      dataToSave.groups[groupId].relatedFields = [...dataToSave.groups[groupId].relatedFields, newField.id];
    }

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
      case DFormElementTypes.Section:
        handleSectionDelete(element, dataClone);
        break;
      case DFormElementTypes.Group:
        handleGroupDelete(element, dataClone);
        break;
      case DFormElementTypes.Block:
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

    group.relatedFields.map((fieldId) => handleFieldDelete({ id: fieldId }, data));

    delete data.groups[group.id];
  };

  const handleFieldDelete = (field, data) => {
    const fieldGroup = Object.values(data.groups).filter((group) => group.relatedFields.includes(String(field.id)))[0];

    if (fieldGroup) {
      data.groups[fieldGroup?.id].relatedFields = removeItemFormArrayByValue(
        data.groups[fieldGroup.id].relatedFields,
        field.id
      );
    }

    data.fields = removeConditionsFromElementById(data, "fields", field.id);
    data.groups = removeConditionsFromElementById(data, "groups", field.id);
    data.sections = removeConditionsFromElementById(data, "sections", field.id);

    delete data.fields[field.id];
  };

  const removeConditionsFromElementById = (data, type, id) => {
    Object.keys(data[type]).forEach((fieldKey) => {
      data[type][fieldKey].conditions = data[type][fieldKey].conditions.filter((condition) => condition.fieldId !== id);
    });

    return data[type];
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
    setIsModuleEditComponentVisible(false);
    setSelectedElement(null);

    let dataToSave;

    if (selectedElement.elementType === DFormElementTypes.Block) {
      dataToSave = embedSuggestedChanges(selectedElement);
    } else {
      dataToSave = embedSuggestedChanges(selectedElement);
    }

    setApplicationData(dataToSave);

    mutateApplication(dataToSave, updateApplication);
  };

  const changeGroupForField = (selectedElement, submittedElement, application) => {
    // submittedElement.groupId exists only if it's changed
    if (!submittedElement.groupId) {
      return application;
    }
    if (selectedElement.groupId === submittedElement.groupId) {
      return application;
    }
    const relatedFields = application.groups[selectedElement.groupId].relatedFields;

    application.groups[selectedElement.groupId].relatedFields = relatedFields.filter(
      (fieldId) => selectedElement.id !== fieldId
    );
    // Fixme: When save a styles on a field
    application.groups[submittedElement.groupId].relatedFields.push(selectedElement.id);

    return application;
  };

  const changeSectionForGroup = (selectedElement, submittedElement, application) => {
    // submittedElement.sectionId exists only if it's changed
    if (!submittedElement.sectionId) {
      return application;
    }
    if (selectedElement.sectionId === submittedElement.sectionId) {
      return application;
    }

    const oldSection = application.sections[selectedElement.sectionId];

    application.sections[oldSection.id].relatedGroups = oldSection.relatedGroups.filter(
      (groupId) => selectedElement.id !== groupId
    );
    application.sections[submittedElement.sectionId].relatedGroups.push(selectedElement.id);

    return application;
  };

  const updateStructureDependencies = (selectedElement, submittedElement, application) => {
    switch (selectedElement.elementType) {
      case DFormElementTypes.Section:
        return application;
      case DFormElementTypes.Group:
        return changeSectionForGroup(selectedElement, submittedElement, application);
      case DFormElementTypes.Block:
        return changeGroupForField(selectedElement, submittedElement, application);
      default:
        return application;
    }
  };

  const onFieldSubmit = (submittedElement) => {
    let obj = {
      ...selectedElement,
      ...submittedElement,
    };

    let dataToSave = embedSuggestedChanges(obj);

    dataToSave = updateStructureDependencies(selectedElement, submittedElement, dataToSave);

    setApplicationData(dataToSave);

    mutateApplication(dataToSave, updateApplication);
  };

  const handleElementChangesCancel = () => {
    setSelectedElement(null);
    setIsModuleEditComponentVisible(false);
  };

  // ToDo: remove edited
  const handleElementChange = (elementData) => {
    let element;
    if (elementData.elementType === DFormElementTypes.Field) {
      element = DFormFieldModel.from(elementData);
      element.edited = true;
    } else {
      element = { ...elementData, edited: true };
    }
    const dataToSave = embedSuggestedChanges(element);

    setSelectedElement(element);
    setApplicationData(dataToSave);
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

  // Reorder
  const handleSectionReorder = (result) => {
    const dataClone = cloneDeep(applicationData);

    const itemToMove = dataClone.sectionsOrder.splice(result.source.index, 1)[0];

    dataClone.sectionsOrder.splice(result.destination.index, 0, itemToMove);

    setApplicationData(dataClone);
  };

  const handleGroupReorder = (result) => {
    const { draggableId: groupId, source, destination } = result;

    const dataClone = cloneDeep(applicationData);

    const { sections } = dataClone;

    const sectionId = Object.keys(sections).find((key) => sections[key].relatedGroups.includes(groupId));

    const itemToMove = dataClone.sections[sectionId].relatedGroups.splice(source.index, 1)[0];

    dataClone.sections[sectionId].relatedGroups.splice(destination.index, 0, itemToMove);

    setApplicationData(dataClone);
  };

  const handleFieldReorder = (result) => {
    const dataClone = cloneDeep(applicationData);

    const { droppableId: idGroupFrom, index: indexFieldFrom } = result.source;
    const { droppableId: idGroupTo, index: indexFieldTo } = result.destination;
    const fieldId = result.draggableId;

    if (idGroupFrom === idGroupTo) {
      dataClone.groups[idGroupFrom].relatedFields = reorderArray(
        dataClone.groups[idGroupFrom].relatedFields,
        indexFieldFrom,
        indexFieldTo
      );
    } else {
      const item = dataClone.groups[idGroupFrom].relatedFields.splice(indexFieldFrom, 1)[0];
      dataClone.groups[idGroupTo].relatedFields.splice(indexFieldTo, 0, item);
      dataClone.fields[fieldId].groupId = idGroupTo;
    }

    setApplicationData(dataClone);
  };

  const handleReorder = (result) => {
    switch (result.type) {
      case DFormElementTypes.Section:
        handleSectionReorder(result);
        break;
      case DFormElementTypes.Group:
        handleGroupReorder(result);
        break;
      case DFormElementTypes.Block:
        handleFieldReorder(result);
        break;
      default:
        throw new Error(`Unexpected element type: ${result.type}`);
    }
  };

  const handleApplicationMutation = (submittedObj) => {
    mutateApplication({ ...applicationData, ...submittedObj }, updateApplication);
    // ToDo: It should be removed
    setApplicationData({ ...applicationData, ...submittedObj });
  };

  let { data: categories } = useDFormTemplateCategoriesQuery({
    organizationId: applicationData?.organization.id,
    organizationType: applicationData?.organization.type,
  });

  let category;

  if (categories) {
    categories = categories.map((category) => parseSelectCategory(category));
    category = categories.find((category) => applicationData.categoryId === category.categoryId);
  }

  const applicationDescriptionData = {
    name: applicationData?.name,
    isPrivate: applicationData?.isPrivate,
    description: applicationData?.description,
    organizationName: applicationData?.organization.name,
    categoryId: category ? getCategoryAsOption(category) : null,
  };

  if (application.isLoading || !applicationData) {
    return <div>Loading...</div>;
  }

  const getFeatureTitle = () => {
    if (process.env.NODE_ENV === "production") return "dForm";
    if (selectedElement?.conditions?.length === 0) return "dForm";

    return (
      <>
        <span>dForm</span>
        <span className="pl-1">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 980 978">
            <path d="M472.5 1.1c-33 3.7-63.4 18.6-88.1 43.3-21.6 21.7-34.4 45.1-41 75.6-1.5 6.8-1.9 12.7-1.9 29.5 0 18.3.3 22.3 2.3 31.5 8.7 39.2 32.6 73.2 66.8 95.2 13.1 8.4 35.1 17.1 50.2 19.9l7.2 1.3V425H143.3l-4.4 2.3c-2.4 1.3-5.7 4.3-7.4 6.6l-3 4.3-.5 120-.5 120.1-8.6 1.8c-58.4 12-103.2 57.4-116.1 117.3-2.9 13.4-3.1 41.5-.5 55.1 9 46.7 37.5 85.2 78.6 106.4 43.5 22.3 93 22.5 136.3.4 41.8-21.3 70.7-60.1 79.4-106.8 2.8-14.6 2.5-41.3-.4-55.1-6.7-31.2-22-58.8-44.4-79.8-21.9-20.7-45.6-32.4-79.6-39.2l-2.2-.4v-99.6c0-108.9-.2-104.3 5.7-107.5 2.2-1.2 49.6-1.4 314.4-1.4H802l3.2 3.3 3.3 3.2v204.3l-10 2.3c-58.7 13.3-101.9 57.3-114.7 116.8-2.9 13.4-3.1 41.3-.5 55.6 10 54 48.9 98.5 100.9 115.4 17 5.5 27 7 46.8 7 19.3-.1 30.4-1.8 47.3-7.5 50.9-17 89.4-61.5 99.3-114.9 2.5-13.2 2.5-41.1 0-53.5-12-60.8-57.8-107.4-117.4-119.4l-8.7-1.8-.5-120.4-.5-120.4-2.4-4.2c-1.4-2.4-4.2-5.5-6.4-7l-4-2.8-163.4-.3L511 425V297.4l6.8-1.2c18-3.1 38.8-11.6 55.8-22.8 11-7.3 27.5-23.1 35.9-34.3 12.7-16.8 22-37.2 26.7-58.1 2-9.2 2.3-13.1 2.3-31.5 0-16.7-.4-22.7-1.9-29.5-6.3-28.9-19.2-53.3-39.1-73.9-32.7-33.9-77.9-50.2-125-45zM510 44.6c47.4 9 83.3 49.6 86.6 98.1 2.4 35.3-13.9 70.7-42.5 92.4-8.5 6.4-24.1 14.1-35.6 17.6-8.5 2.5-10.2 2.7-28.5 2.7-18.4 0-20-.2-28.5-2.7-25.4-7.8-46.2-22.8-60-43.7-7.4-11.1-11.7-20.6-15.3-33.9-2.2-8.4-2.5-11.6-2.5-25.6 0-14 .3-17.2 2.6-25.8 3-11.1 9.4-25.5 15.7-34.8 9.6-14.2 28-29.5 44.6-37 6.1-2.7 20.5-7 27.4-8.2 6.6-1.1 28.4-.6 36 .9zM161.5 720.1c25.1 3.1 46.1 13.5 64 31.5 20.4 20.6 30.5 45.2 30.5 74.7 0 19-3.1 32.1-11.7 48.8-29.1 57-101.5 75.5-154.8 39.6-8.4-5.6-21.6-18.7-27.4-27.1-9.4-13.8-15.6-28.9-18.1-44.8-1.8-11-.8-32.1 1.9-42.5 11.2-42.9 47.1-74.6 90.6-80.2 10-1.2 14.8-1.2 25 0zm695.6 4.8c38.5 10.6 67.1 39.4 77.1 77.5 2.6 10.3 3.6 31.5 1.8 42.4-7.2 44.8-41.6 80.2-86.3 88.7-10.3 2-28.3 1.9-38.8-.1-35.2-6.7-64.8-30.5-78.9-63.4-6.2-14.8-7.5-21.7-7.5-41.5 0-15.7.3-19.1 2.3-26.5 10.4-37.9 40-67.6 76.7-76.9 11.9-3 11.7-3 29.5-2.6 13 .2 18.1.7 24.1 2.4z" />
          </svg>
        </span>
      </>
    );
  };

  const recognizeBlockType = (fieldType) => {
    switch (fieldType) {
      case "helpText":
        return DFormBlockTypes.HelpText;
      default:
        return DFormBlockTypes.Field;
    }
  };

  return (
    <Row>
      <ApplicationWrapper name={`dForm » ${applicationData.name}`}>
        <CustomTabs
          active={selectedPage}
          onChange={handlePageChange}
          tabs={Object.values(APPLICATION_PAGES)}
          className="mb-3"
        />

        <TabContent activeTab={selectedPage}>
          <TabPane tabId={APPLICATION_PAGES.DESCRIPTION}>
            <ApplicationDescription
              applicationDescriptionData={applicationDescriptionData}
              categories={categories}
              onSubmit={handleApplicationMutation}
            />
          </TabPane>
          <TabPane tabId={APPLICATION_PAGES.DESIGN}>
            <DFormTemplateEditor
              blocks={Object.values(applicationData.fields).map((block) => ({
                id: block.id,
                label: block.title,
                helpText: block.helpTextValue,
                blockType: recognizeBlockType(block.type),
                fieldType: block.type,
                blockSize: block.classes,
                isRequired: block.isRequired,
                isLabelShowing: block.isLabelShowing,
              }))}
              groups={Object.values(applicationData.groups).map((group) => ({
                id: group.id,
                name: group.name,
                relatedBlocks: group.relatedFields,
              }))}
              sections={applicationData.sectionsOrder
                .map((sectionId) => applicationData.sections[sectionId])
                .map((section) => ({
                  id: section.id,
                  name: section.name,
                  relatedGroups: section.relatedGroups,
                }))}
              isDraggable={false}
              selectedElementId={selectedElement?.id}
              onBlockClick={(blockId) =>
                handleSelectElementForEdit(applicationData.fields[blockId], DFormElementTypes.Block)
              }
              onGroupClick={(groupId) =>
                handleSelectElementForEdit(applicationData.groups[groupId], DFormElementTypes.Group)
              }
              onSectionClick={(sectionId) =>
                handleSelectElementForEdit(applicationData.sections[sectionId], DFormElementTypes.Section)
              }
              onBlockCreate={handleFieldCreate}
              onGroupCreate={handleGroupCreate}
              onSectionCreate={handleSectionCreate}
            />
          </TabPane>
          <TabPane tabId={APPLICATION_PAGES.REORDER}>
            <ElementsReorderComponent onReorder={handleReorder} applicationData={applicationData} />
          </TabPane>
        </TabContent>

        {selectedPage !== "Description" ? (
          <div className="px-3">
            <div className="application_delimiter" />

            <div className="d-flex justify-content-center">
              <Button
                color="primary"
                className="button button-success"
                disabled={updateApplication.isLoading || !!selectedElement}
                onClick={handleApplicationMutation}
              >
                Save
              </Button>
            </div>
          </div>
        ) : null}
      </ApplicationWrapper>

      {isModuleEditComponentVisible ? (
        <ContextFeatureTemplate contextFeatureTitle={getFeatureTitle()}>
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
            onFieldSubmit={onFieldSubmit}
          />
        </ContextFeatureTemplate>
      ) : null}
    </Row>
  );
};
