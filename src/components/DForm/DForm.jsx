import "./styles.scss";

import { cloneDeep } from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { DFormContextProvider } from "./DFormContext";

import SectionsComponent from "./Components/Sections";
import SectionsSideBar from "./Components/SectionsSideBar";

import {
  DCREffectProps,
  DCRFieldValueConvertors,
  DCRExpectedValueConvertor,
  DCROperatorTypesComparotors,
} from "features/Applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";

const getInitialSelectedSection = ({ sectionsOrder }) => (sectionsOrder ? sectionsOrder[0] : null);

const getInitialSectionsProgress = ({ sections }) =>
  Object.values(sections).reduce((acc, curr) => ({ ...acc, [curr.name]: 0 }), {});

const checkConditions = (elements, values, fields) => {
  for (const elementId in elements) {
    if (!Object.hasOwnProperty.call(elements, elementId)) continue;
    const element = elements[elementId];
    const conditions = element.conditions;

    // ToDo: reducing that with operator OR
    for (const condition of conditions) {
      const { operatorType, effectType, fieldId, expectedValue } = condition;

      const field = fields[fieldId];
      const convertor = DCRFieldValueConvertors[field.type];
      const controlValue = values[field.masterSchemaFieldId];
      const operatorComparator = DCROperatorTypesComparotors[operatorType];

      const isApplicable = operatorComparator({
        type: field.type,
        control: convertor(controlValue),
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
    selectedElement,
    isMemberView,
    isConfigurable,
    accessType,
    onGroupCreate,
    onElementClick,
    onSectionCreate,
    onFieldCreate,
    onFieldChange,
  } = props;

  const schema = isConfigurable ? propSchema : applyConditionalRender(propSchema, values);

  const sectionsProgress = getInitialSectionsProgress(schema);
  const [selectedSection, setSelectedSection] = useState(() => getInitialSelectedSection(schema));

  const onSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);

    const section = schema.sections[sectionId];

    if (isConfigurable) {
      onElementClick(section, "section");
    }

    if (!section.isAlreadyViewed) {
      /*TODO move this to parent component that handle ONBOARDING
       * make an api call in parent component to mark section as "already viewed"
       */
      // dFormApi.updateViewedSections(...);
    }
  };

  return (
    <DFormContextProvider
      dFormId={dFormId}
      accessType={accessType}
      isMemberView={isMemberView}
      isConfigurable={isConfigurable}
    >
      <div className={`new-dform ${isConfigurable ? "edit-mode" : ""}`}>
        <SectionsSideBar
          errors={[]}
          sections={schema.sectionsOrder.map((sectionId) => schema.sections[sectionId])}
          completed={undefined}
          isConfigurable={isConfigurable}
          selectedSection={selectedSection}
          sectionsProgress={sectionsProgress}
          onSectionCreate={onSectionCreate}
          onSectionSelect={onSectionSelect}
        />
        <SectionsComponent
          data={schema}
          values={values}
          selectedSection={selectedSection}
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
