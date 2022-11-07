import "./styles.scss";

import React, { useState } from "react";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";

import { DFormFieldTypes } from "features/dform/types";
import { DFormContextProvider } from "./DFormContext";

import SectionsComponent from "./Components/Sections";
import SectionsSideBar from "./Components/SectionsSideBar";

import {
  DCREffectProps,
  DCRFieldValueConvertors,
  DCRExpectedValueConvertor,
  DCROperatorTypesComparotors,
} from "features/applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";

const extractValue = (controlValue, fieldType) => {
  switch (fieldType) {
    case DFormFieldTypes.File:
    case DFormFieldTypes.FileList:
      return controlValue.files;
    default:
      return controlValue.value;
  }
};

const checkConditions = (elements, values, fields) => {
  for (const elementId in elements) {
    if (!Object.hasOwnProperty.call(elements, elementId)) continue;
    const element = elements[elementId];
    const conditions = element.conditions;

    for (const condition of conditions) {
      const { operatorType, effectType, fieldId, expectedValue } = condition;

      const field = fields[fieldId];

      const convertor = DCRFieldValueConvertors[field.type];
      const controlValue = values[field.masterSchemaFieldId];
      const directValue = extractValue(controlValue, field.type);
      const operatorComparator = DCROperatorTypesComparotors[operatorType];

      const isApplicable = operatorComparator({
        type: field.type,
        control: convertor(directValue),
        expected: DCRExpectedValueConvertor(expectedValue, field.type),
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
    schema: propSchema,
    values,
    dFormId,
    accessType,
    isMemberView,
    isConfigurable,
    currentSection,
    selectedElement,
    renderSections = true,
    onElementClick,
    onGroupCreate,
    onFieldCreate,
    onSectionCreate,
    onFieldChange,
  } = props;
  const schema = isConfigurable ? propSchema : applyConditionalRender(propSchema, values);

  const [selectedSectionId, selectSection] = useState(() => schema.sectionsOrder[0]);

  return (
    <DFormContextProvider
      dFormId={dFormId}
      accessType={accessType}
      isMemberView={isMemberView}
      isConfigurable={isConfigurable}
    >
      <div className={`new-dform ${isConfigurable ? "edit-mode" : ""}`}>
        {renderSections ? (
          <SectionsSideBar
            errors={[]}
            sections={schema.sectionsOrder.map((sectionId) => schema.sections[sectionId])}
            completed={undefined}
            isConfigurable={isConfigurable}
            selectedSection={selectedSectionId}
            sectionsProgress={{}}
            onSectionCreate={onSectionCreate}
            onSectionSelect={selectSection}
          />
        ) : null}
        <SectionsComponent
          data={schema}
          values={values}
          selectedSection={renderSections ? selectedSectionId : currentSection}
          selectedElement={selectedElement}
          onElementClick={onElementClick}
          onGroupCreate={onGroupCreate}
          onFieldCreate={onFieldCreate}
          onFieldChange={onFieldChange}
        />
      </div>
    </DFormContextProvider>
  );
};

DForm.propTypes = {
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired,
    sectionsOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  // ToDo: Normalize value
  // values: PropTypes.objectOf(
  //   PropTypes.oneOfType([
  //     PropTypes.string,
  //     PropTypes.number,
  //     PropTypes.bool,
  //     PropTypes.arrayOf(PropTypes.string),
  //     PropTypes.arrayOf(
  //       PropTypes.shape({
  //         name: PropTypes.string.isRequired,
  //         file_id: PropTypes.number,
  //       })
  //     ),
  //   ])
  // ),
};
