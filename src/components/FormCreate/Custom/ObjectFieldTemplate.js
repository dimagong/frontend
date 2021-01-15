import {Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import React, {useState} from "react";
import classnames from "classnames";
import Constants from "../Parts/Constants";
import {isElementProtected} from "../helper";
import HelpText from "./HelpText";
import Sections from '../Elements/Sections'
import Groups from '../Elements/Groups'
import Field from "../Elements/Field";
import _ from 'lodash'

export function ObjectFieldTemplate(props) {

  const renderCustomFieldsComponents = (element) => {
    switch (element.content.props.schema.type) {
      case Constants.FIELD_TYPE_HELP_TEXT: {
        return HelpText(element.content.props);
      }
      default: {
        return element.content;
      }
    }
  };

  const checkUiOptionField = (objKey, option) => {
    if (!this.state.uiSchema[objKey] || !this.state.uiSchema[objKey][Constants.UI_OPTIONS]) return true;

    if (this.state.uiSchema[objKey][Constants.UI_OPTIONS] && this.state.uiSchema[objKey][Constants.UI_OPTIONS][option]) {
      return true
    }
    return false;
  };

  const getColumnClass = (key, element) => {
    let classes = [];
    let colClass = key in props.uiSchema.columnsClasses ? props.uiSchema.columnsClasses[key] : 'col-md-12';
    classes.push(colClass);
    if (!checkUiOptionField(element.name, 'label')) {
      classes.push('label-hide');
    }
    return classes.join(' ');
  };

  const elementsByGroups = () => {
    const groups = {};

    const groupedFields = Object.keys(this.state.uiSchema.groups);

    const groupedProperties = Object.keys(props.uiSchema.sectionGroups).map((groupName) => {
      return props.properties.filter(element => {
        if (element.name in this.state.uiSchema.groups && groupName === this.state.uiSchema.groups[element.name]) {
          return true;
        }
        return false;
      });
    });

    groupedProperties.forEach(gropedElements => {
      gropedElements.forEach((element) => {
        if (groupedFields.indexOf(element.name) !== -1) {
          const groupName = props.uiSchema.groups[element.name];
          if (!Array.isArray(groups[groupName])) {
            groups[groupName] = [];
          }
          groups[groupName].push(element);
        } else {
          if (!Array.isArray(groups[Constants.WITHOUT_GROUP + element.name])) {
            groups[Constants.WITHOUT_GROUP + element.name] = [];
          }
          groups[Constants.WITHOUT_GROUP + element.name].push(element);
        }
      });
    });
    return groups;
  };

  const getUniqueValues = (notUniqArray) => {
    return notUniqArray.filter((value, index, arr) => arr.indexOf(value) === index);
  };

  const getSections = () => {
    const sections = Object.keys(this.state.uiSchema.onlySections);
    return getUniqueValues(sections);
  };

  const isElementInSection = (elementContentKey, sectionName) => {
    return elementContentKey in this.state.uiSchema.sections && this.state.uiSchema.sections[elementContentKey] === sectionName;
  };
  const isSectionHaveOneElement = (elements, sectionName) => {
    const fieldsNames = elements.map(element => element.name);
    const found = fieldsNames.some(fieldName => isElementInSection(fieldName, sectionName));
    return !!found;
  };

  const renderElementsByGroupsAndSections = (sectionName) => {
    return Object.keys(groupedElements).map((groupName, index) => {

      if (!isSectionHaveOneElement(groupedElements[groupName], sectionName)) {
        return null;
      }

      let elementContent = groupedElements[groupName];

      // todo ordering
      if (this.state.uiSchema.fieldsOrdering && this.state.uiSchema.fieldsOrdering.length) {

        const elementNames = elementContent.map(element => String(element.name));
        const filteredOrderingElementNames = this.state.uiSchema.fieldsOrdering.filter(elementName => elementNames.indexOf(String(elementName)) !== -1);
        elementContent = filteredOrderingElementNames.map(nextName => {
          return elementContent.find(elementContentElement => String(elementContentElement.name) === String(nextName));
        });
      }
      // todo end ordering

      elementContent = elementContent.map(element => {
        if (isElementInSection(element.name, sectionName)) {
          const isElementHidden = (elementKey) => {
            let isHidden = elementKey in this.state.uiSchema && Constants.UI_HIDDEN in this.state.uiSchema[elementKey] && this.state.uiSchema[elementKey][Constants.UI_HIDDEN]
              ? {display: 'none'} : {};

            if (isElementProtected(this.state, 'fields', elementKey) && this.state.isShowProtectedElements) {
              isHidden = {display: 'none'};
            }
            return isHidden;
          };

          let fieldClasses = [getColumnClass(element.name, element)];

          if (~this.state.uiSchema?.errors?.field.indexOf(parseInt(element.name))) {
            fieldClasses.push("field-with-error")
          }

          if (this.state.schema?.required.includes(parseInt(element.name))) {
            fieldClasses.push("required-field")
          }

          const fieldProps = {
            key: element.name,
            className: fieldClasses.join(" "),
            style: isElementHidden(element.name)
          };

          return <Field {...fieldProps}>
            {renderCustomFieldsComponents(element)}
          </Field>

        }
        return null;
      });

      if (groupName.indexOf('WITHOUT_GROUP') !== -1) {
        // todo
        // return <div key={`${sectionName}-${groupName}-${index}`} className="row mt-2 mb-2">

        //     {elementContent}

        // </div>;

        return null;
      }

      let isHidden = groupName in this.state.uiSchema.groupStates && Constants.UI_HIDDEN in this.state.uiSchema.groupStates[groupName] && this.state.uiSchema.groupStates[groupName][Constants.UI_HIDDEN]
        ? {display: 'none'} : {};

      if (isElementProtected(this.state, 'groups', groupName) && this.state.isShowProtectedElements) {
        isHidden = {display: 'none'};
      }

      const propsGroup = {
        key: sectionName + '_' + groupName,
        GroupIsHidden: isHidden,
        groupName
      };

      return <Groups {...propsGroup}>
        {elementContent}
      </Groups>
    })
  };

  const renderElementsWithNoGroupsAndSections = (sectionName) => {
    return Object.keys(groupedElements).map((groupName, index) => {

      if (!isSectionHaveOneElement(groupedElements[groupName], sectionName)) {
        return null;
      }

      if (groupName.indexOf('WITHOUT_GROUP') === -1) {
        return null
      }
      let elementContent = groupedElements[groupName].map(element => {
        if (isElementInSection(element.name, sectionName)) {
          const isElementHidden = (elementKey) => {
            let isHidden = elementKey in this.state.uiSchema && Constants.UI_HIDDEN in this.state.uiSchema[elementKey] && this.state.uiSchema[elementKey][Constants.UI_HIDDEN]
              ? {display: 'none'} : {};

            if (isElementProtected(this.state, 'fields', elementKey) && this.state.isShowProtectedElements) {
              isHidden = {display: 'none'};
            }
            return isHidden;
          };

          const fieldProps = {
            key: element.name,
            className: getColumnClass(element.name, element),
            style: isElementHidden(element.name)
          };

          return <Field {...fieldProps}>
            {element.content}
          </Field>
        }
        return null;
      });

      return elementContent
    })
  };

  const isSectionHidden = (section, effect) => {
    let isHidden = section in this.state.uiSchema.sectionStates && Constants.UI_HIDDEN in this.state.uiSchema.sectionStates[section] && this.state.uiSchema.sectionStates[section][Constants.UI_HIDDEN]
      ? {display: 'none'} : {};
    if (isElementProtected(this.state, 'sections', section) && this.state.isShowProtectedElements) {
      isHidden = {display: 'none'};
    }
    return isHidden;
  };

  const checkIsSectionHidden = (section, effect) => {
    let isHidden = section in this.state.uiSchema.sectionStates && Constants.UI_HIDDEN in this.state.uiSchema.sectionStates[section] && this.state.uiSchema.sectionStates[section][Constants.UI_HIDDEN];
    if (isElementProtected(this.state, 'sections', section) && this.state.isShowProtectedElements) {
      isHidden = true;
    }
    return isHidden;
  };

  const sections = getSections();
  const groupedElements = elementsByGroups();
  const defaultTab = sections.length ? sections.findIndex(section => !checkIsSectionHidden(section)) : -1;

  const isSectionDisabled = (section) => {
    return section in this.state.uiSchema.sectionStates && Constants.UI_DISABLED in this.state.uiSchema.sectionStates[section] && this.state.uiSchema.sectionStates[section][Constants.UI_DISABLED]
      ? {disabled: 'disabled'} : {};
  };
  const getErrors = () => {
    return this.state.uiSchema.errors || {};
  };

  const getProgress = (section) => {

    console.log('getProgress');

    let isFieldEmpty = (data) => (
      data === ""
      || (Array.isArray(data) && data.length === 0)
      || data === null
      || data === false
    );

    const sections = this.state.uiSchema.sections;

    const fields = Object.keys(sections);

    const currentSectionFields = fields.filter((field) => (sections[field] === section));

    const requiredFieldsToString = this.state.schema.required.map(field => String(field));

    let currentSectionRequiredFields = currentSectionFields.filter((field) => requiredFieldsToString.some(rField => String(field) === rField));

    currentSectionRequiredFields = currentSectionRequiredFields.filter((field) => {

      if (field in this.state.uiSchema &&
        (
          (Constants.UI_DISABLED in this.state.uiSchema[field] && this.state.uiSchema[field][Constants.UI_DISABLED] && this.state.dFormTemplate.status !== "submitted")
          ||
          (Constants.UI_HIDDEN in this.state.uiSchema[field] && this.state.uiSchema[field][Constants.UI_HIDDEN])
        )
      ) {
        return false
      }
      return true
    });

    const total = currentSectionRequiredFields.length;

    const completed = currentSectionRequiredFields.filter((field) => !isFieldEmpty(this.state.formData[field])).length;

    if (total === 0) return 0;

    return (completed / total) * 100;
  };

  const renderObject = () => {

    const sectionsProps = {
      defaultTab,
      sections,
      isSectionHidden,
      isSectionDisabled,
      renderElementsByGroupsAndSections,
      renderElementsWithNoGroupsAndSections,
      getErrors,
      getProgress,
    };

    return (<div>
      {props.title}
      {props.description}

      <Sections {...sectionsProps}></Sections>

    </div>);
  };

  return (
    <div>
      {renderObject()}
    </div>
  );
}
