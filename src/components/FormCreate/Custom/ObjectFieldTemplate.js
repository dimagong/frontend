import {Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import React, {useState} from "react";
import classnames from "classnames";
import Constants from "../Parts/Constants";
import {isElementProtected} from "../helper";
import HelpText from "./HelpText";

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
    classes.push(key in props.uiSchema.columnsClasses ? props.uiSchema.columnsClasses[key] : 'col-md-12');
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

      const elementContent = groupedElements[groupName].map(element => {
        if (isElementInSection(element.name, sectionName)) {
          const isElementHidden = (elementKey) => {
            let isHidden = elementKey in this.state.uiSchema && Constants.UI_HIDDEN in this.state.uiSchema[elementKey] && this.state.uiSchema[elementKey][Constants.UI_HIDDEN]
              ? {display: 'none'} : {};

            if (isElementProtected(this.state, 'fields', elementKey) && this.state.isShowProtectedElements) {
              isHidden = {display: 'none'};
            }
            return isHidden;
          };

          return (
            <div style={isElementHidden(element.name)} className={getColumnClass(element.name, element)}
                 key={element.name}>
              {renderCustomFieldsComponents(element)}
            </div>)
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

      return (
        <div className="border px-2" key={sectionName + '_' + groupName} style={isHidden}>
          <div className="title pt-2 pb-0">
            <span className="text-bold-500 font-medium-2 ml-50">{groupName}</span>
            <hr/>
          </div>
          <Row>
            {elementContent}
          </Row>
        </div>
      )
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
          return (
            <div style={isElementHidden(element.name)} className={getColumnClass(element.name, element)}
                 key={element.name}>
              {element.content}
            </div>)
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

  const [keyTab, setKeyTab] = useState(defaultTab);

  const isSectionDisabled = (section) => {
    return section in this.state.uiSchema.sectionStates && Constants.UI_DISABLED in this.state.uiSchema.sectionStates[section] && this.state.uiSchema.sectionStates[section][Constants.UI_DISABLED]
      ? {disabled: 'disabled'} : {};
  };

  const renderObject = () => {
    return (<div>
      {props.title}
      {props.description}

      <Nav tabs className="mt-1">
        {
          sections.map((section, index) =>
            <NavItem style={isSectionHidden(section)} key={`tab-display-${section}`} {...isSectionDisabled(section)}>
              <NavLink
                className={classnames({
                  active: keyTab == index
                })}
                onClick={() => {
                  setKeyTab(index)
                }}
              >
                <span className="align-middle ml-50">{section}</span>
              </NavLink>
            </NavItem>
          )
        }
      </Nav>
      <TabContent activeTab={keyTab}>
        {
          sections.map((section, index) =>
            <TabPane tabId={index} key={section} style={isSectionHidden(section)}>
              <Row className="mx-0" col="12">
                <Col className="pl-0" sm="12">
                  {
                    renderElementsByGroupsAndSections(section)
                  }
                  <Row className="mt-1 mb-1">
                    {renderElementsWithNoGroupsAndSections(section)}
                  </Row>
                </Col>
              </Row>
            </TabPane>
          )
        }
      </TabContent>

    </div>);
  };

  return (
    <div>
      {renderObject()}
    </div>
  );
}
