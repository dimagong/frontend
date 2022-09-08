import "./styles.scss";

import { cloneDeep } from "lodash";
import React, { useState } from "react";

import { DFormContextProvider } from "./DFormContext";

import SectionsComponent from "./Components/Sections";
import SectionsSideBar from "./Components/SectionsSideBar";

import {
  DCREffectProps,
  DCRFieldValueConvertors,
  DCROperatorTypesComparotors,
} from "features/Applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";

const getInitialSelectedSection = (data) => (data.sectionsOrder ? data.sectionsOrder[0] : "");

const getInitialSectionsProgress = (data) =>
  Object.values(data.sections).reduce((acc, curr) => ({ ...acc, [curr.name]: 0 }), {});

const checkConditions = (elements, values, fields) => {
  for (const elementId in elements) {
    if (!Object.hasOwnProperty.call(elements, elementId)) continue;
    const element = elements[elementId];
    const conditions = element.conditions;

    // ToDo: reducing that with operator OR
    for (const condition of conditions) {
      const { operatorType, effectType, fieldId, expectedValue } = condition;

      const field = fields[fieldId];
      const value = values[field.masterSchemaFieldId];
      const preparedValue = DCRFieldValueConvertors[field.type](value);
      const operatorComparator = DCROperatorTypesComparotors[operatorType];
      const isApplicable = operatorComparator({
        expected: expectedValue,
        control: preparedValue,
        controlType: field.type,
      });

      if (isApplicable) {
        const propName = DCREffectProps[effectType];
        elements[elementId][propName] = isApplicable;
      }
    }
  }

  return elements;
};

const applyConditionalRender = (schema, values) => {
  if (!schema) return null;
  // Do not apply conditions on empty values
  if (Object.keys(values).length === 0) return schema;

  const schemaCopy = cloneDeep(schema);

  const { fields, sections, groups } = schemaCopy;

  schemaCopy.fields = checkConditions(fields, values, fields);
  schemaCopy.groups = checkConditions(groups, values, fields);
  schemaCopy.sections = checkConditions(sections, values, fields);

  return schemaCopy;
};

export const DForm = (props) => {
  const {
    data: propData,
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

  const data = isConfigurable ? propData : applyConditionalRender(propData, values);

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
          sections={data.sectionsOrder && data.sectionsOrder.map((sectionId) => data.sections[sectionId])}
          completed={undefined}
          isConfigurable={isConfigurable}
          selectedSection={selectedSection}
          sectionsProgress={sectionsProgress}
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
