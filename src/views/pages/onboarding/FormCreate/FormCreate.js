import React, {useState} from 'react';
import Form from "@rjsf/core";
import ElementEditModal from "./ElementEditModal";
import DependencyEditModal from "./DependencyEditModal";
// import { Tabs, Tab, Card, FormGroup } from "react-bootstrap";
import classnames from "classnames"
import rfdc from 'rfdc';
import {
  Nav,
  NavItem,
  TabContent,
  Row,
  Col,
  NavLink,
  TabPane,
  Button,
  CardTitle,
  Card,
  FormGroup,
  CardBody,
  CardHeader,
  Badge
} from 'reactstrap';
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import {X, Check, Plus} from "react-feather"
import Select from "react-select"

const WITHOUT_GROUP = 'WITHOUT_GROUP_';
const EFFECT_DISABLED = 'disabled';
const EFFECT_HIDDEN = 'hidden';

const clone = rfdc();

/**
 * @return {boolean}
 */
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function ErrorListTemplate(props) {
  const {errors} = props;
  return (
    <div>
      <h2>Custom error list</h2>
      <ul>
        {errors.map(error => (
          <li key={error.stack}>
            {error.stack}
          </li>
        ))}
      </ul>
    </div>
  );
}
class FormCreate extends React.Component {

  state = {};

  constructor(props) {

    super(props);

    this.state = this.initState(props);
    //this.state.uiSchema.
    this.refTitles = React.createRef();
  }

  initState(props) {
    const propsDFormSchema = clone(props.dForm.schema.schema);
    const propsDFormUiSchema = clone(props.dForm.schema.uiSchema);

    if (
      props.fill &&
      props.fill === true &&
      props.dForm.submit_data &&
      Object.keys(props.dForm.submit_data).length) {
      Object.keys(props.dForm.submit_data).forEach((key => {
        if (key in propsDFormSchema.properties) {
          propsDFormSchema.properties[key].default = props.dForm.submit_data[key];

          if (this.props.inputDisabled) {
            propsDFormUiSchema[key] = {
              'ui:disabled': true
            };
          }
        }
      }))
    }
    return {
      additionalData: {
        name: props.dForm.name,
        description: props.dForm.description
      },
      refresh: false,
      tabConfig: 0,
      inputDisabled: props.inputDisabled === true ? true : false,
      fieldEdit: {
        propertyKey: ''
      },
      onSaveButtonHidden: props.onSaveButtonHidden === true ? true : false,
      dFormActions: [
        {value: "submitted", label: "Submitted"},
        {value: "approved", label: "Approved"},
        {value: "rejected", label: "Rejected"},
        {value: "unsubmitted", label: "Unsubmitted"},
      ],
      dFormSelectedAction: this.getSelectedDFormAction(props.dForm.status),
      uiSettings: {
        section: '',
        group: '',
        classes: '',
        dependencies: {}
      },
      uiSchemaPropertyEdit: {
        'ui:options': {
          label: true
        }
      },
      formData: {},
      sumbitFormData: {},
      dFormTemplate: props.dForm,
      schemaPropertyEdit: {},
      schemaRequiredFields: [],
      schema: propsDFormSchema,
      controls: {
        default: {
          type: "string",
          title: "Some Title",
          default: '',
        },
        text: {
          type: "string",
          title: "Some Title",
          default: '',
        },
        textarea: {
          type: "string",
          format: 'textarea',
          title: "Some Title",
          default: '',
        },
        boolean: {
          type: "boolean",
          title: "Some Title",
        },
        fileList: {
          "type": "array",
          "title": "A list of files",
          "items": {
            "type": "string",
            "format": "data-url"
          }
        },
        number: {
          type: "number",
          title: "Some Title",
          default: '',
        },
        file: {
          title: "Some Title",
          type: "string",
          format: "data-url",
        },
        date: {
          type: "string",
          format: "date-time"
        },
        select: {
          "type": "string",
          "title": "Enum",
          "enum": [
            "test1",
            "test2"
          ]
        },
        multiSelect: {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "title": "Color",
            "type": "string",
            "anyOf": [
              {
                "type": "string",
                "enum": [
                  "value1"
                ],
                "title": "key1"
              },
              {
                "type": "string",
                "enum": [
                  "value2"
                ],
                "title": "key2"
              }
            ]
          }
        }
      },
      controlTypes: ['text', 'textarea', 'number', 'boolean', 'date', 'select', 'multiSelect', 'file', 'fileList'],
      type: 'text',
      section: '',
      uiSchema: propsDFormUiSchema
    };
  }


  CustomCheckbox = (props) => {
    return (
      <div>
        {props.options.label ? <label>{props.label}</label> : null}
        <Checkbox
          color="primary"
          icon={<Check className="vx-icon" size={16}/>}
          onChange={event => props.onChange(!props.value)}
          label={props.label}
          checked={props.value}
        />
      </div>
    );
  };
  CustomCheckboxes = (props) => {
    let onChange = (option) => {
      let values = clone(props.value);

      let indexCheckbox = values.indexOf(option.value);
      if (indexCheckbox !== -1) {
        values.splice(indexCheckbox, 1)
      } else {
        values.push(option.value);
      }
      return values;
    };
    return (
      props.options.enumOptions.map((option, key) => {
        return <Checkbox
          color="primary"
          icon={<Check className="vx-icon" size={16}/>}
          onChange={event => props.onChange(onChange(option))}
          label={option.label}
          checked={props.value.indexOf(option.value) !== -1}
        />
      })
    );
  };

  getSelectedDFormAction(action) {
    return {
      value: action,
      label: action
    }
  }

  setSelectedDFormAction(action) {
    this.setState({dFormSelectedAction: action})
    this.props.statusChanged && this.props.statusChanged(action.value);
  }

  ObjectFieldTemplate = (props) => {

    const getColumnClass = (key, element) => {
      let classes = [];
      classes.push(key in props.uiSchema.columnsClasses ? props.uiSchema.columnsClasses[key] : 'col-md-12');
      if(!this.checkUiOptionField(element.name, 'label')) {
        classes.push('label-hide');
      }
      return classes.join(' ');
    };

    const elementsByGroups = () => {
      const groups = {};

      const groupedFields = Object.keys(this.state.uiSchema.groups);
      props.properties.forEach(element => {
        if (groupedFields.indexOf(element.content.key) !== -1) {
          const groupName = props.uiSchema.groups[element.content.key];
          if (!Array.isArray(groups[groupName])) {
            groups[groupName] = [];
          }
          groups[groupName].push(element);
        } else {
          if (!Array.isArray(groups[WITHOUT_GROUP + element.content.key])) {
            groups[WITHOUT_GROUP + element.content.key] = [];
          }
          groups[WITHOUT_GROUP + element.content.key].push(element);
        }
      });
      return groups;
    };

    const getUniqueValues = (notUniqArray) => {
      return notUniqArray.filter((value, index, arr) => arr.indexOf(value) === index);
    };

    const getSections = () => {
      const sections = Object.values(this.state.uiSchema.sections);
      return getUniqueValues(sections);
    };

    const isElementInSection = (elementContentKey, sectionName) => {
      return elementContentKey in this.state.uiSchema.sections && this.state.uiSchema.sections[elementContentKey] === sectionName;
    };
    const isSectionHaveOneElement = (elements, sectionName) => {
      const fieldsNames = elements.map(element => element.content.key);
      const found = fieldsNames.some(fieldName => isElementInSection(fieldName, sectionName));
      return !!found;
    };

    const renderElementsByGroupsAndSections = (sectionName) => {
      return Object.keys(groupedElements).map((groupName, index) => {

        if (!isSectionHaveOneElement(groupedElements[groupName], sectionName)) {
          return null;
        }

        const elementContent = groupedElements[groupName].map(element => {
          if (isElementInSection(element.content.key, sectionName)) {
            const isElementHidden = (elementKey) => {
              return elementKey in this.state.uiSchema && 'ui:hidden' in this.state.uiSchema[elementKey] && this.state.uiSchema[elementKey]['ui:hidden']
                ? {display: 'none'} : {}
            }
            return (<div style={isElementHidden(element.content.key)} className={getColumnClass(element.content.key, element)}
                         key={element.content.key}>
              {element.content}
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

        let isHidden = groupName in this.state.uiSchema.groupStates && 'ui:hidden' in this.state.uiSchema.groupStates[groupName] && this.state.uiSchema.groupStates[groupName]['ui:hidden']
          ? {display: 'none'} : {}

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
        const elementContent = groupedElements[groupName].map(element => {
          if (isElementInSection(element.content.key, sectionName)) {
            const isElementHidden = (elementKey) => {
              return elementKey in this.state.uiSchema && 'ui:hidden' in this.state.uiSchema[elementKey] && this.state.uiSchema[elementKey]['ui:hidden']
                ? {display: 'none'} : {}
            }
            return (<div style={isElementHidden(element.content.key)} className={getColumnClass(element.content.key, element)}
                         key={element.content.key}>
              {element.content}
            </div>)
          }
          return null;
        });

        return elementContent
      })
    };

    const sections = getSections();
    const groupedElements = elementsByGroups();

    const defaultTab = sections.length ? 0 : -1;

    const [keyTab, setKeyTab] = useState(defaultTab);


    const isSectionHidden = (section, effect) => {
      return section in this.state.uiSchema.sectionStates && 'ui:hidden' in this.state.uiSchema.sectionStates[section] && this.state.uiSchema.sectionStates[section]['ui:hidden']
        ? {display: 'none'} : {}
    };

    const isSectionDisabled = (section) => {
      return section in this.state.uiSchema.sectionStates && 'ui:disabled' in this.state.uiSchema.sectionStates[section] && this.state.uiSchema.sectionStates[section]['ui:disabled']
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
              <TabPane tabId={index} key={section}>
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

  formSubmit = (event) => {

    let formData = event.formData;

    Object.keys(formData).forEach(key => {
      if (key in this.state.uiSchema &&
        (
          ('ui:disabled' in this.state.uiSchema[key] && this.state.uiSchema[key]['ui:disabled'])
          ||
          ('ui:hidden' in this.state.uiSchema[key] && this.state.uiSchema[key]['ui:hidden'])
        )
      ) {
        delete formData[key];
      }
    })

    document.querySelectorAll('.error-detail').forEach(nextElement => {
      nextElement.parentNode.removeChild(nextElement);
    })

    this.setState({sumbitFormData: formData});

    if (this.props.onSubmit) {
      this.props.onSubmit(formData);
    }
    console.log(formData);
    return true;
  }

  getFieldsByGroup = (state, groupName) => {
    let fields = [];
    for (let fieldInGroup in state.uiSchema.groups) {
      if (state.uiSchema.groups[fieldInGroup] !== groupName) continue;
      fields.push(fieldInGroup);
    }
    return fields;
  }


  getFieldsBySection = (state, sectionName) => {
    let fields = [];
    for (let fieldInGroup in state.uiSchema.sections) {
      if (state.uiSchema.sections[fieldInGroup] !== sectionName) continue;
      fields.push(fieldInGroup);
    }
    return fields;
  }

  getEffectByType = (type) => {
    switch (type) {
      case 'disabled': {
        return 'ui:disabled';
      }
      case 'hidden': {
        return 'ui:hidden';
      }
      default: {
        return 'ui:no-effect';
      }
    }
  }

  getEffects = () => {
    return ['', EFFECT_DISABLED, EFFECT_HIDDEN];
  }

  operatorResult = (operator, fieldValue, value, field = null) => {
    if (!fieldValue || !value) return true;
    const typeField = this.getSpecificType(this.state.schema.properties[field]);
    switch (operator) {
      case '=': {

        if (Array.isArray(fieldValue)) {
          if (fieldValue.some(nextFieldValue => nextFieldValue === value)) {
            return true;
          }

          return false;
        }
        if (typeField === 'number') {
          if (parseFloat(fieldValue) === parseFloat(value)) {
            return true;
          }
          return false;
        }

        if (fieldValue === value) {
          return true;
        }
        return false;
      }
      case '!=': {

        if (Array.isArray(fieldValue)) {
          if (fieldValue.some(nextFieldValue => nextFieldValue !== value)) {
            return true;
          }

          return false;
        }

        if (typeField === 'number') {
          if (parseFloat(fieldValue) !== parseFloat(value)) {
            return true;
          }
          return false;
        }

        if (fieldValue !== value) {
          return true;
        }

        return false;
      }
      case '>': {

        if (Array.isArray(fieldValue)) {
          if (fieldValue.some(nextFieldValue => nextFieldValue > value)) {
            return true;
          }

          return false;
        }
        if (typeField === 'number') {
          if (parseFloat(fieldValue) > parseFloat(value)) {
            return true;
          }
          return false;
        }

        if (fieldValue.length > value) {
          return true;
        }

        return false;
      }
      case '<': {

        if (Array.isArray(fieldValue)) {
          if (fieldValue.some(nextFieldValue => nextFieldValue < value)) {
            return true;
          }

          return false;
        }
        if (typeField === 'number') {
          if (parseFloat(fieldValue) < parseFloat(value)) {
            return true;
          }
          return false;
        }
        if (fieldValue.length < value) {
          return true;
        }

        return false;
      }
      default: {
        return false
      }
    }
  }

  isValidationFieldPassed = (state, field) => {

    if (!(field in state.formData) && 'minLength' in state.schema.properties[field] && state.schema.properties[field]['minLength'] > 0) {
      return false;
    }

    if ('minLength' in state.schema.properties[field] && state.formData[field].length < state.schema.properties[field]['minLength']) {
      return false;
    }

    if ('maxLength' in state.schema.properties[field] && state.formData[field].length > state.schema.properties[field]['maxLength']) {
      return false;
    }

    return true;
  }

  dependencyChecker = (state) => {

    let fieldsStates = {};
    let groupsStates = {};
    let sectionsStates = {};

    const setField = (field, value, effect) => {
      if (!Array.isArray(fieldsStates[field])) {
        fieldsStates[field] = [];
      }
      fieldsStates[field].push({value: value, effect: effect})
    };

    const setGroup = (field, value, effect) => {
      if (!Array.isArray(groupsStates[field])) {
        groupsStates[field] = [];
      }
      groupsStates[field].push({value: value, effect: effect})
    };

    const setSection = (field, value, effect) => {
      if (!Array.isArray(sectionsStates[field])) {
        sectionsStates[field] = [];
      }
      sectionsStates[field].push({value: value, effect: effect})
    };

    Object.keys(state.uiSchema.dependencies.fields).forEach((field) => {
      if (!('conditions' in state.uiSchema.dependencies.fields[field])) return;

      const effect = this.getEffectByType(state.uiSchema.dependencies.fields[field].effect);

      state.uiSchema.dependencies.fields[field].conditions.forEach(condition => {

        // todo add function universal
        for (let fieldOperator of condition.fieldOperators) {
          // check required

          if (!(field in state.uiSchema)) {
            state.uiSchema[field] = {};
          }

          if (!(fieldOperator.field in state.formData) || !state.formData[fieldOperator.field]) {
            setField(field, true, effect);
            continue;
          }

          const fieldValue = state.formData[fieldOperator.field];

          if (this.operatorResult(fieldOperator.operator, fieldValue, fieldOperator.value, fieldOperator.field)) {
            setField(field, true, effect);
            continue;
          }

          setField(field, false, effect);
        }

        for (let conditionField of condition.fields) {
          // check required
          if (!(field in state.uiSchema)) {
            state.uiSchema[field] = {};
          }
          if (!state.formData[conditionField] || !this.isValidationFieldPassed(state, conditionField)) {
            setField(field, true, effect);
          } else {
            setField(field, false, effect);
          }
        }

        for (let conditionGroup of condition.groups) {
          if (!(field in state.uiSchema)) {
            state.uiSchema[field] = {};
          }
          let isDisabled = this.getFieldsByGroup(state, conditionGroup).some((fieldInGroup) => {
            return !(fieldInGroup in state.formData) ||
              (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
              !state.formData[fieldInGroup] || !this.isValidationFieldPassed(state, fieldInGroup)
          });

          if (isDisabled) {
            setField(field, true, effect);
          } else {
            setField(field, false, effect);
          }
        }
      });
    });

    Object.keys(state.uiSchema.dependencies.groups).forEach((settingGroup) => {
      if (!('conditions' in state.uiSchema.dependencies.groups[settingGroup])) return;
      let isGroupDisabled = false;

      const effect = this.getEffectByType(state.uiSchema.dependencies.groups[settingGroup].effect);

      state.uiSchema.dependencies.groups[settingGroup].conditions.forEach(condition => {

        for (let fieldOperator of condition.fieldOperators) {
          // check required

          if (!(settingGroup in state.uiSchema.groupStates)) {
            state.uiSchema.groupStates[settingGroup] = {};
          }

          const fieldValue = state.formData[fieldOperator.field];
          const isDisabled = this.operatorResult(fieldOperator.operator, fieldValue, fieldOperator.value, fieldOperator.field);

          const setStateForFieldsCurrGroup = () => {

            this.getFieldsByGroup(state, settingGroup).forEach((fieldInGroup) => {
              if (!(fieldInGroup in state.uiSchema)) {
                state.uiSchema[fieldInGroup] = {};
              }
              if (isDisabled) {
                setField(fieldInGroup, true, effect);
              } else {
                setField(fieldInGroup, false, effect);
              }
            });
          }

          if (!(fieldOperator.field in state.formData) || !state.formData[fieldOperator.field]) {
            state.uiSchema.groupStates[settingGroup][effect] = true;
            setStateForFieldsCurrGroup();
            continue;
          }

          if (isDisabled) {
            setGroup(settingGroup, true, effect);
          } else {
            setGroup(settingGroup, false, effect);
          }
          setStateForFieldsCurrGroup();
        }

        if (condition.fields.length) {
          // check required
          if (!(settingGroup in state.uiSchema.groupStates)) {
            state.uiSchema.groupStates[settingGroup] = {};
          }
          let isDisabled = condition.fields.some((fieldInGroup) => {
            return !(fieldInGroup in state.formData) ||
              (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
              !state.formData[fieldInGroup] || !this.isValidationFieldPassed(state, fieldInGroup)
          });

          if (isDisabled) {
            setGroup(settingGroup, true, effect);
          } else {
            setGroup(settingGroup, false, effect);
          }

          this.getFieldsByGroup(state, settingGroup).forEach((fieldInGroup) => {
            if (!(fieldInGroup in state.uiSchema)) {
              state.uiSchema[fieldInGroup] = {};
            }
            if (isDisabled) {
              setField(fieldInGroup, true, effect);
            } else {
              setField(fieldInGroup, false, effect);
            }
          });
        }

        for (let conditionGroup of condition.groups) {

          // check required
          if (!(settingGroup in state.uiSchema.groupStates)) {
            state.uiSchema.groupStates[settingGroup] = {};
          }

          let isDisabled = this.getFieldsByGroup(state, conditionGroup).some((fieldInGroup) => {
            return !(fieldInGroup in state.formData) ||
              (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
              !state.formData[fieldInGroup] || !this.isValidationFieldPassed(state, fieldInGroup)
          });
          if (isDisabled) {
            setGroup(settingGroup, true, effect);
          } else {
            setGroup(settingGroup, false, effect);
          }
          this.getFieldsByGroup(state, settingGroup).forEach((fieldInGroup) => {
            if (!(fieldInGroup in state.uiSchema)) {
              state.uiSchema[fieldInGroup] = {};
            }
            if (isDisabled) {
              setField(fieldInGroup, true, effect);
            } else {
              setField(fieldInGroup, false, effect);
            }
          });
        }
      })
    });

    Object.keys(state.uiSchema.dependencies.sections).forEach((settingSection) => {
      if (!('conditions' in state.uiSchema.dependencies.sections[settingSection])) return;

      const effect = this.getEffectByType(state.uiSchema.dependencies.sections[settingSection].effect);

      state.uiSchema.dependencies.sections[settingSection].conditions.forEach(condition => {

        for (let fieldOperator of condition.fieldOperators) {
          // check required

          if (!(settingSection in state.uiSchema.sectionStates)) {
            state.uiSchema.sectionStates[settingSection] = {};
          }

          const fieldValue = state.formData[fieldOperator.field];
          const isDisabled = this.operatorResult(fieldOperator.operator, fieldValue, fieldOperator.value, fieldOperator.field);

          const setStateForFieldsCurrSection = () => {

            this.getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
              if (!(fieldInSection in state.uiSchema)) {
                state.uiSchema[fieldInSection] = {};
              }
              if (isDisabled) {
                setField(fieldInSection, true, effect);
              } else {
                setField(fieldInSection, false, effect);
              }
            });
          }

          if (!(fieldOperator.field in state.formData) || !state.formData[fieldOperator.field]) {
            setSection(settingSection, true, effect);
            setStateForFieldsCurrSection();
            continue;
          }

          if (isDisabled) {
            setSection(settingSection, true, effect);
          } else {
            setSection(settingSection, false, effect);
          }
          setStateForFieldsCurrSection();
        }

        if (condition.fields.length) {
          // check required
          if (!(settingSection in state.uiSchema.sectionStates)) {
            state.uiSchema.sectionStates[settingSection] = {};
          }
          let isDisabled = condition.fields.some((fieldInGroup) => {
            return !(fieldInGroup in state.formData) ||
              (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
              !state.formData[fieldInGroup] || !this.isValidationFieldPassed(state, fieldInGroup)
          });

          if (isDisabled) {
            setSection(settingSection, true, effect);
          } else {
            setSection(settingSection, false, effect);
          }

          this.getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
            if (!(fieldInSection in state.uiSchema)) {
              state.uiSchema[fieldInSection] = {};
            }
            if (isDisabled) {
              setField(fieldInSection, true, effect);
            } else {
              setField(fieldInSection, false, effect);
            }
          });
        }

        for (let conditionGroup of condition.groups) {

          // check required
          if (!(settingSection in state.uiSchema.sectionStates)) {
            state.uiSchema.sectionStates[settingSection] = {};
          }

          let isDisabled = this.getFieldsByGroup(state, conditionGroup).some((fieldInGroup) => {
            return !(fieldInGroup in state.formData) ||
              (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
              !state.formData[fieldInGroup] || !this.isValidationFieldPassed(state, fieldInGroup)
          });
          if (isDisabled) {
            setSection(settingSection, true, effect);
          } else {
            setSection(settingSection, false, effect);
          }
          this.getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
            if (!(fieldInSection in state.uiSchema)) {
              state.uiSchema[fieldInSection] = {};
            }
            if (isDisabled) {
              setField(fieldInSection, true, effect);
            } else {
              setField(fieldInSection, false, effect);
            }
          });
        }

        for (let conditionSection of condition.sections) {

          // check required
          if (!(settingSection in state.uiSchema.sectionStates)) {
            state.uiSchema.sectionStates[settingSection] = {};
          }

          let isDisabled = this.getFieldsBySection(state, conditionSection).some((fieldInGroup) => {
            return !(fieldInGroup in state.formData) ||
              (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
              !state.formData[fieldInGroup] || !this.isValidationFieldPassed(state, fieldInGroup)
          });
          if (isDisabled) {
            setSection(settingSection, true, effect);
          } else {
            setSection(settingSection, false, effect);
          }
          this.getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
            if (!(fieldInSection in state.uiSchema)) {
              state.uiSchema[fieldInSection] = {};
            }
            if (isDisabled) {
              setField(fieldInSection, true, effect);
            } else {
              setField(fieldInSection, false, effect);
            }
          });
        }
      })
    });

    Object.keys(fieldsStates).forEach(field => {
      if (!(field in state.uiSchema)) {
        state.uiSchema[field] = {};
      }

      let hidden = fieldsStates[field].find(fieldObj => {
        return fieldObj.value && fieldObj.effect === 'ui:hidden';
      });
      let disabled = fieldsStates[field].find(fieldObj => {
        return fieldObj.value && fieldObj.effect === 'ui:disabled';
      });

      if (hidden) {
        state.uiSchema[field][hidden.effect] = true;
        return;
      }
      if (disabled) {
        state.uiSchema[field][disabled.effect] = true;
        return;
      }

      state.uiSchema[field] = {};
    })


    Object.keys(groupsStates).forEach(group => {
      if (!(group in state.uiSchema.groupStates)) {
        state.uiSchema.groupStates[group] = {};
      }

      let hidden = groupsStates[group].find(groupObj => {
        return groupObj.value && groupObj.effect === 'ui:hidden';
      });
      let disabled = groupsStates[group].find(groupObj => {
        return groupObj.value && groupObj.effect === 'ui:disabled';
      });

      if (hidden) {
        state.uiSchema.groupStates[group][hidden.effect] = true;
        return;
      }
      if (disabled) {
        state.uiSchema.groupStates[group][disabled.effect] = true;
        return;
      }

      state.uiSchema.groupStates[group] = {};
    })


    Object.keys(sectionsStates).forEach(section => {
      if (!(section in state.uiSchema.sectionStates)) {
        state.uiSchema.sectionStates[section] = {};
      }

      let hidden = sectionsStates[section].find(sectionObj => {
        return sectionObj.value && sectionObj.effect === 'ui:hidden';
      });
      let disabled = sectionsStates[section].find(sectionObj => {
        return sectionObj.value && sectionObj.effect === 'ui:disabled';
      });

      if (hidden) {
        state.uiSchema.sectionStates[section][hidden.effect] = true;
        return;
      }
      if (disabled) {
        state.uiSchema.sectionStates[section][disabled.effect] = true;
        return;
      }

      state.uiSchema.sectionStates[section] = {};
    })
  }

  onChangeForm = (event) => {
    let state = clone(this.state);
    state.formData = event.formData;
    this.dependencyChecker(state);

    this.setState(state);
  }

  submit = (event) => {
    this.setState((state) => {
      state.formData = event.formData;
      return {
        state
      }
    })

  };

  handleJsonChange(value) {
    if (IsJsonString(value)) {
      this.setState({
        schema: JSON.parse(value)
      });
    }
  }

  handleTitleChange(event) {
    this.setState({
      schema: Object.assign({}, this.state.schema, {
        title: event.target.value
      })
    });
  }

  inputHandlerRequired = (event, value) => {
    this.setState((state) => {
      let schemaRequiredFields = this.state.schemaRequiredFields;
      let index = schemaRequiredFields.indexOf(value);
      if (index === -1) {
        schemaRequiredFields.push(value);
      } else {
        schemaRequiredFields.splice(index, 1);
      }
      return {
        schemaRequiredFields
      }
    });
  };

  getDefaultValueByType(type) {
    switch (type) {
      case 'string': {
        return '';
      }
      case 'integer': {
        return 0;
      }
      case 'number': {
        return 0;
      }
      case 'boolean': {
        return false;
      }
      default: {
        return null
      }
    }
  }

  removePropertyField(previousFieldKey, stateOut = false) {
    let state = stateOut || clone(this.state);
    let schema = state.schema;
    const properties = schema.properties;
    schema.properties = {};

    Object.keys(properties).forEach((deepIndex, deepCounter) => {
      if (previousFieldKey === deepIndex) {
        return;
      }
      schema.properties[deepIndex] = properties[deepIndex];
    });

    if (previousFieldKey in this.state.uiSchema.sections) {
      delete state.uiSchema.sections[previousFieldKey];
    }
    if (previousFieldKey in this.state.uiSchema.groups) {
      delete state.uiSchema.groups[previousFieldKey];
    }

    if (previousFieldKey in state.formData) {
      delete state.formData[previousFieldKey];
    }

    let requiredFieldIndex = schema.required.indexOf(previousFieldKey);
    if (requiredFieldIndex !== -1) {
      schema.required.splice(requiredFieldIndex, 1);
    }

    // dependencies for fields

    if (previousFieldKey in state.uiSchema.dependencies.fields) {
      delete state.uiSchema.dependencies.fields[previousFieldKey];
    }

    const dependencyTypes = ['fields', 'groups', 'sections'];

    dependencyTypes.forEach(dependencyType => {

      let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

      dependencyFields.forEach((fieldKey) => {
        if (
          'conditions' in state.uiSchema.dependencies[dependencyType][fieldKey] &&
          Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
        ) {
          state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[dependencyType][fieldKey].conditions.map((condition) => {
            condition.fieldOperators.forEach((fieldOperator, index) => {
              if (fieldOperator.field === previousFieldKey) {
                condition.fieldOperators.splice(index, 1)
              }
            });
            let previousIndexFieldKey = condition.fields.indexOf(previousFieldKey);
            if (previousIndexFieldKey > -1) {
              condition.fields.splice(previousIndexFieldKey, 1);
            }
            // groups
            // sections
            return condition;
          })
        }
      });
    })


    this.setState(state);
  }

  // rename object key
  inputKeyObjectHandler = (previousFieldKey) => {
    const newFieldKey = this.state.fieldEdit.propertyKey
    if (newFieldKey === previousFieldKey) return;

    let state = clone(this.state);
    let schema = state.schema;
    const properties = schema.properties;
    schema.properties = {};

    Object.keys(properties).forEach((deepIndex, deepCounter) => {
      if (previousFieldKey === deepIndex) {
        schema.properties[newFieldKey] = properties[deepIndex];
        return;
      }
      schema.properties[deepIndex] = properties[deepIndex];
    });

    if (previousFieldKey in this.state.uiSchema.sections) {
      state.uiSchema.sections[newFieldKey] = this.state.uiSchema.sections[previousFieldKey];
      delete state.uiSchema.sections[previousFieldKey];
    }
    if (previousFieldKey in this.state.uiSchema.groups) {
      state.uiSchema.groups[newFieldKey] = this.state.uiSchema.groups[previousFieldKey];
      delete state.uiSchema.groups[previousFieldKey];
    }

    if (previousFieldKey in state.formData) {
      state.formData[newFieldKey] = state.formData[previousFieldKey];
      delete state.formData[previousFieldKey];
    }

    let requiredFieldIndex = schema.required.indexOf(previousFieldKey);
    if (requiredFieldIndex !== -1) {
      schema.required[requiredFieldIndex] = newFieldKey;
    }

    // dependencies for fields

    if (previousFieldKey in state.uiSchema.dependencies.fields) {
      state.uiSchema.dependencies.fields[newFieldKey] = state.uiSchema.dependencies.fields[previousFieldKey];
      delete state.uiSchema.dependencies.fields[previousFieldKey];
    }

    const dependencyTypes = ['fields', 'groups', 'sections'];

    dependencyTypes.forEach(dependencyType => {

      let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

      dependencyFields.forEach((fieldKey) => {
        if (
          'conditions' in state.uiSchema.dependencies[dependencyType][fieldKey] &&
          Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
        ) {
          state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[dependencyType][fieldKey].conditions.map((condition) => {
            condition.fieldOperators = condition.fieldOperators.map(fieldOperator => {
              if (fieldOperator.field === previousFieldKey) {
                fieldOperator.field = newFieldKey;
              }
              return fieldOperator;
            });
            let previousIndexFieldKey = condition.fields.indexOf(previousFieldKey);
            if (previousIndexFieldKey > -1) {
              condition.fields.splice(previousIndexFieldKey, 1);
              condition.fields.push(newFieldKey)
            }
            // groups
            // sections
            return condition;
          })
        }
      });
    })


    this.setState(state);
  };

  inputChangeHandler = (event, index, prop) => {
    // const { target: { value } } = event;

    // let schema = clone(this.state.schema);
    // if (prop === 'type') {
    //     delete schema.properties[index]['minimum'];
    //     delete schema.properties[index]['maximum'];
    //     delete schema.properties[index]['maxLength'];
    //     delete schema.properties[index]['minLength'];
    //     //schema.properties[index].default = this.getDefaultValueByType(value);
    //     schema.properties[index] = this.state.controls[value];
    // } else {
    //     schema.properties[index][prop] = value;
    // }

    // this.setState({ schema: schema });
    const {target: {value}} = event;

    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    if (prop === 'type') {
      delete schemaPropertyEdit['minimum'];
      delete schemaPropertyEdit['maximum'];
      delete schemaPropertyEdit['maxLength'];
      delete schemaPropertyEdit['minLength'];
      //schemaPropertyEdit.default = this.getDefaultValueByType(value);
      schemaPropertyEdit = this.state.controls[value];
    } else {
      schemaPropertyEdit[prop] = value;
    }

    this.setState({schemaPropertyEdit});
  };

  inputNumberChangeHandler = (event, index, prop) => {
    // const { target: { value } } = event;
    // let schema = clone(this.state.schema);
    // if (!value) {
    //     delete schema.properties[index][prop];
    // } else {
    //     schema.properties[index][prop] = parseInt(value, 10);
    // }

    // this.setState({ schema: schema });
    const {target: {value}} = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    if (!value) {
      delete schemaPropertyEdit[prop];
    } else {
      schemaPropertyEdit[prop] = parseInt(value, 10);
    }

    this.setState({schemaPropertyEdit});
  };

  makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  addControl = (sectionName, groupName) => {
    this.setState(state => {
      let schema = clone(this.state.schema);
      let uiSchema = clone(this.state.uiSchema);
      let propertyName = "property_default " + (Object.keys(schema.properties).length + 1);
      if (propertyName in schema.properties) {
        propertyName += this.makeid(9);
      }
      schema.properties[propertyName] = this.state.controls[this.state.type];
      uiSchema.sections[propertyName] = sectionName;
      uiSchema.groups[propertyName] = groupName;

      return {
        schema,
        uiSchema
      }
    });
  };

  componentDidUpdate() {
  }

  componentDidMount() {

  }

  getSpecificType(property) {
    if (property.type === 'string' && 'format' in property && (property.format === 'date' || property.format === 'date-time')) {
      return 'date';
    } else if (property.type === 'string' && 'enum' in property) {
      return 'select';
    } else if (property.type === 'array' && 'items' in property && 'format' in property.items && (property.items.format === 'data-url' || property.items.format === 'file')) {
      return 'fileList';
    } else if (property.type === 'array' && 'items' in property) {
      return 'multiSelect';
    } else if (property.type === 'string' && 'format' in property && property.format === 'textarea') {
      return 'textarea';
    } else if (property.type === 'string' && 'format' in property && (property.format === 'data-url' || property.format === 'file')) {
      return 'file';
    } else if (property.type === 'string') {
      return 'text';
    } else if (property.type === 'number') {
      return 'number';
    } else if (property.type === 'boolean') {
      return 'boolean';
    }
  }

  setSelectValues = (event, objKey, index) => {
    const {target: {value}} = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit['enum'][index] = value;
    this.setState({schemaPropertyEdit})
  };

  addSelectValues = (event, objKey, index) => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit['enum'].push('');
    this.setState({schemaPropertyEdit})
  };

  removeSelectValues = (event, objKey, index) => {
    // let schema = clone(this.state.schema);
    // schema.properties[objKey]['enum'].splice(index, 1);
    // this.setState({ schema })
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit['enum'].splice(index, 1);
    this.setState({schemaPropertyEdit})
  };

  setMultiSelectValues = (event, objKey, index) => {
    const {target: {value}} = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit['items']['anyOf'][index]['enum'][0] = value;
    this.setState({schemaPropertyEdit})
  };
  setMultiSelectTitle = (event, objKey, index) => {
    const {target: {value}} = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit['items']['anyOf'][index].title = value;
    this.setState({schemaPropertyEdit})
  };

  addMultiSelectValues = (event, objKey, index) => {
    // let schema = clone(this.state.schema);
    // schema.properties[objKey]['items']['anyOf'].push({
    //     "type": "string",
    //     "enum": [
    //         ""
    //     ],
    //     "title": ""
    // });
    // this.setState({ schema })
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit['items']['anyOf'].push({
      "type": "string",
      "enum": [
        ""
      ],
      "title": ""
    });
    this.setState({schemaPropertyEdit})
  };

  removeMultiSelectValues = (event, objKey, index) => {
    // let schema = clone(this.state.schema);
    // schema.properties[objKey]['items']['anyOf'].splice(index, 1);
    // this.setState({ schema })
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit['items']['anyOf'].splice(index, 1);
    this.setState({schemaPropertyEdit})
  };

  elementEditModalSave(objKey) {
    let schema = clone(this.state.schema);
    let uiSchema = clone(this.state.uiSchema);
    schema.properties[objKey] = clone(this.state.schemaPropertyEdit);
    uiSchema[objKey] = clone(this.state.uiSchemaPropertyEdit);
    schema.required = clone(this.state.schemaRequiredFields);

    this.setState({schema, uiSchema}, () => {
      this.inputKeyObjectHandler(objKey);
    })
  }

  elementEditModalOpened = (column) => {
    let schemaPropertyEdit = clone(this.state.schema.properties[column]);
    let uiSchemaPropertyEdit = column in this.state.uiSchema ? clone(this.state.uiSchema[column]) : {};
    let schemaRequiredFields = clone(this.state.schema.required);

    const fieldEdit = clone(this.state.fieldEdit);
    fieldEdit.propertyKey = column;
    this.setState({fieldEdit, schemaPropertyEdit, uiSchemaPropertyEdit, schemaRequiredFields});
  };

  changeUiSchemaTemplateMultiselect(event) {
    let uiSchemaPropertyEdit = clone(this.state.uiSchemaPropertyEdit);
    let suspendedValue = event.target.value;
    if (suspendedValue === 'checkboxes') {
      uiSchemaPropertyEdit['ui:widget'] = suspendedValue;
    } else if ('ui:widget' in uiSchemaPropertyEdit) {
      delete uiSchemaPropertyEdit['ui:widget'];
    }

    this.setState({uiSchemaPropertyEdit})
  }

  getUiSchemaTemplateMultiselect(objKey) {
    if ("ui:widget" in this.state.uiSchemaPropertyEdit && this.state.uiSchemaPropertyEdit["ui:widget"] === 'checkboxes') {
      return this.state.uiSchemaPropertyEdit["ui:widget"];
    }

    return 'default';
  }

  checkUiOptionField(objKey, option) {
    if (!this.state.uiSchema[objKey] || !this.state.uiSchema[objKey]["ui:options"]) return true;

    if (this.state.uiSchema[objKey]["ui:options"] && this.state.uiSchema[objKey]["ui:options"][option]) {
      return true
    }
    return false;
  }

  getLabelShowingCheckbox() {
    if (!this.state.uiSchemaPropertyEdit["ui:options"]) return true;

    if (this.state.uiSchemaPropertyEdit["ui:options"] && this.state.uiSchemaPropertyEdit["ui:options"]['label']) {
      return true
    }
    return false;
  }

  setLabelShowingCheckbox() {
    let uiSchemaPropertyEdit = clone(this.state.uiSchemaPropertyEdit);
    if (!('ui:options' in uiSchemaPropertyEdit)) {
      uiSchemaPropertyEdit['ui:options'] = {}
    }
    uiSchemaPropertyEdit['ui:options']['label'] = !this.getLabelShowingCheckbox();
    uiSchemaPropertyEdit['ui:options']['title'] = !this.getLabelShowingCheckbox();
    console.log(uiSchemaPropertyEdit);
    this.setState({uiSchemaPropertyEdit})
  }

  getListControls(properties) {
    let keys = Object.keys(properties);
    let schemaPropertyEdit = this.state.schemaPropertyEdit;
    const renderConfigFields = ((objKey, index) => {

      // add collback for inputHandlerRequired and custom changes
      const renderInputNumberColumn = (column, placeholder, defaultValue = 0) => {
        return (<input
            id={`${index}-${column}`}
            value={column in schemaPropertyEdit ? schemaPropertyEdit[column] : defaultValue}
            type="number"
            onChange={event => this.inputNumberChangeHandler(event, objKey, column)}
            className="form-control" placeholder={placeholder}/>
        );
      };

      const renderKeyObjectColumn = (column, placeholder) => {
        return (<input readOnly={true} id={`${index}-${column}`}
                       value={objKey} type="text"
                       ref={this.refTitles}
                       data-id={objKey}
                       onChange={event => this.inputKeyObjectHandler(event, objKey)}
                       className="form-control"
                       placeholder={placeholder}/>)
      };

      const renderKeyObjectEditColumn = (column, placeholder) => {
        return (
          <div>
            <div className="row" key={index}>
              <div className="col-md-12 form-group">
                <input id={`${index}-${column}`}
                       value={this.state.fieldEdit.propertyKey} type="text"
                       ref={this.refTitles}
                       data-id={objKey}
                       onChange={event => this.setState({fieldEdit: {propertyKey: event.target.value}})}
                       className="form-control"
                       placeholder={placeholder}/>
                {/* <Button disabled={this.state.fieldEdit.propertyKey === objKey ? true : false}
                                    onClick={this.inputKeyObjectHandler.bind(this, objKey)}
                                    type="submit"
                                    color={(this.state.fieldEdit.propertyKey === objKey ? 'light' : 'primary')}>Save</Button> */}
              </div>
            </div>

          </div>)
      };

      const renderInputColumn = (column, placeholder, inputType = "text", defaultValue = '') => {
        return (<input
            id={`${index}-${column}`}
            value={column in schemaPropertyEdit ? schemaPropertyEdit[column] : defaultValue}
            type={inputType}
            onChange={event => this.inputChangeHandler(event, objKey, column)}
            className="form-control" placeholder={placeholder}/>
        );
      };

      const renderSelectColumn = (column, values) => {
        return (<select
            id={`${index}-${column}`}
            className="form-control"
            value={schemaPropertyEdit[column]}
            onChange={event => this.inputChangeHandler(event, objKey, column)}
          >
            {values.map((type, indexType) => <option
              key={indexType}>{type}</option>)}
          </select>
        );
      };

      const renderRequiredColumn = (column, text) => {
        return (
          <div className="w-100">
            {/* <input type="checkbox"
                            className=""
                            id={`${index}-${column}`}
                            onChange={event => this.inputHandlerRequired(event, objKey)}
                            checked={this.state.schema.required.indexOf(objKey) !== -1}
                        /> */}
            {/* <label htmlFor={`${index}-${column}`}>{text}</label> */}
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16}/>}
              label="Is required"
              id={`${index}-${column}`}
              onChange={event => this.inputHandlerRequired(event, objKey)}
              checked={this.state.schemaRequiredFields.indexOf(objKey) !== -1}
            />
          </div>
        );
      };

      const renderLabelShowing = (column) => {
        return <div className="w-100">
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16}/>}
            label="Label showing"
            id={`${index}-${column}`}
            onChange={event => this.setLabelShowingCheckbox()}
            checked={this.getLabelShowingCheckbox()}
          />
        </div>
      };

      const renderLabel = (column, text) => {
        return (<label htmlFor={`${index}-${column}`}>{text}</label>)
      };

      const specificType = this.getSpecificType(schemaPropertyEdit);

      const renderSpecificType = () => {

        switch (specificType) {
          case 'text': {
            return (
              <Row>
                <Col md="6">
                  <FormGroup>
                    {renderLabel('minLength', 'Min length')}
                    {renderInputNumberColumn('minLength', 'Min length')}
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    {renderLabel('maxLength', 'Max length')}
                    {renderInputNumberColumn('maxLength', 'Max length')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderRequiredColumn(objKey, 'Required?')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderLabelShowing(objKey, 'Required?')}
                  </FormGroup>
                </Col>
              </Row>
            );
          }
          case 'number': {
            return (
              <Row>
                <Col md="6">
                  <FormGroup>
                    {renderLabel('minimum', 'Min length')}
                    {renderInputNumberColumn('minimum', 'Min length')}
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    {renderLabel('maximum', 'Max length')}
                    {renderInputNumberColumn('maximum', 'Max length')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderRequiredColumn(objKey, 'Required?')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderLabelShowing(objKey, 'Required?')}
                  </FormGroup>
                </Col>
              </Row>
            );
          }
          case 'file': {
            return (
              <Row>
                <Col md="12">
                  <FormGroup>
                    {renderRequiredColumn(objKey, 'Required?')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderLabelShowing(objKey, 'Required?')}
                  </FormGroup>
                </Col>
              </Row>
            );
          }
          case 'fileList': {
            return (
              <Row>
                <Col md="12">
                  <FormGroup>
                    {renderRequiredColumn(objKey, 'Required?')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderLabelShowing(objKey, 'Required?')}
                  </FormGroup>
                </Col>
              </Row>
            );
          }
          case 'boolean': {
            return (
              <Row>
                <Col md="12">
                  <FormGroup>
                    {renderRequiredColumn(objKey, 'Required?')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderLabelShowing(objKey, 'Required?')}
                  </FormGroup>
                </Col>
              </Row>
            );
          }
          case 'textarea': {
            return (
              <Row>
                <Col md="6">
                  <FormGroup>
                    {renderLabel('minLength', 'Min length')}
                    {renderInputNumberColumn('minLength', 'Min length')}
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    {renderLabel('maxLength', 'Max length')}
                    {renderInputNumberColumn('maxLength', 'Max length')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderRequiredColumn(objKey, 'Required?')}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    {renderLabelShowing(objKey, 'Required?')}
                  </FormGroup>
                </Col>
              </Row>
            );
          }
          case 'date': {
            return (<div>
              {renderLabel('format', 'Format')}
              {renderSelectColumn('format', ['date', 'date-time'])}
              <div>
                {renderRequiredColumn(objKey, 'Required?')}
              </div>
              <Col md="12">
                <FormGroup>
                  {renderLabelShowing(objKey, 'Required?')}
                </FormGroup>
              </Col>
            </div>)
          }
          case 'select': {
            return (<div>
              {schemaPropertyEdit.enum.map((enumInput, index) => {
                return (
                  <div className="row" key={index}>
                    <div className="col-md-10 form-group">
                      <input
                        id={`${index}-`}
                        value={enumInput}
                        type="text"
                        onChange={event => this.setSelectValues(event, objKey, index)}
                        className="form-control"/>
                    </div>

                    <div className="col-md-2 form-group">
                      <button type="submit"
                              onClick={event => this.removeSelectValues(event, objKey, index)}
                              className="btn btn-danger">X
                      </button>
                    </div>

                  </div>
                );
              })}
              <div className="text-center">
                <button type="submit" onClick={event => this.addSelectValues(event, objKey, index)}
                        className="btn btn-primary">Add
                </button>
              </div>
              <div>
                {renderRequiredColumn(objKey, 'Required?')}
              </div>
              <Col md="12">
                <FormGroup>
                  {renderLabelShowing(objKey, 'Required?')}
                </FormGroup>
              </Col>
            </div>)
          }
          case 'multiSelect': {
            return (<div>
              <div className="row" key={index}>
                <div className="col-md-12 form-group">
                  {renderLabel('uischema-multiselect-checkboxes', 'UI style')}
                  <select id="uischema-multiselect-checkboxes" className="form-control"
                          value={this.getUiSchemaTemplateMultiselect(objKey)}
                          onChange={(event) => this.changeUiSchemaTemplateMultiselect(event)}>
                    <option>default</option>
                    <option>checkboxes</option>
                  </select>
                </div>
                <div className="col-md-12">
                  {schemaPropertyEdit.items.anyOf.map((multiSelectObj, index) => {
                    return (
                      <div className="row" key={index}>
                        <div className="col-md-5 form-group">
                          <input
                            id={`${index}-`}
                            value={multiSelectObj.title}
                            type="text"
                            onChange={event => this.setMultiSelectTitle(event, objKey, index)}
                            className="form-control"/>
                        </div>
                        <div className="col-md-5 form-group">
                          <input
                            key={index}
                            id={`${index}-`}
                            value={multiSelectObj.enum[0]}
                            type="text"
                            onChange={event => this.setMultiSelectValues(event, objKey, index)}
                            className="form-control"/>
                        </div>

                        <div className="col-md-2 form-group">
                          <button type="submit"
                                  onClick={event => this.removeMultiSelectValues(event, objKey, index)}
                                  className="btn btn-danger">X
                          </button>
                        </div>

                      </div>
                    );
                  })}
                  <div className="text-center">
                    <button type="submit"
                            onClick={event => this.addMultiSelectValues(event, objKey, index)}
                            className="btn btn-primary">Add
                    </button>
                  </div>
                </div>
                <div className="col-md-12">
                  {renderRequiredColumn(objKey, 'Required?')}
                </div>
                <div className="col-md-12">
                  <FormGroup>
                    {renderLabelShowing(objKey, 'Required?')}
                  </FormGroup>
                </div>
              </div>
            </div>)
          }
          default:
            return (<div></div>)
        }
      };

      let dependencyFields = this.renderDependencyPart('fields', objKey);

      return (
        <div
          className={objKey in this.state.uiSchema.columnsClasses ? this.state.uiSchema.columnsClasses[objKey] : 'col-md-12'}
          key={'control-edit-' + objKey + '-' + index}>
          {this.state.schema.properties[objKey].title ? renderLabel('property-' + objKey, this.state.schema.properties[objKey].title) : 'Empty title'}
          <div className="form-group position-relative">
            <div className="pull-right-icons position-relative">
              {renderKeyObjectColumn('property-' + objKey, 'Property')}
              <Badge
                color="primary position-absolute dform-type-badget">{this.getSpecificType(this.state.schema.properties[objKey])}</Badge>
            </div>

            <div className="d-flex dform-input-setting">
              <div className="vertical-center dform-input">
                <ElementEditModal onOpen={() => this.elementEditModalOpened(objKey)}
                                  onSave={() => this.elementEditModalSave(objKey)}>
                  {renderLabel('property-' + objKey, 'Property')}
                  <div className="form-group">
                    {renderKeyObjectEditColumn('property-' + objKey, 'Property')}
                  </div>
                  {renderLabel('title', 'Title')}
                  <div className="form-group">
                    {renderInputColumn('title', 'Title')}
                  </div>
                  <div className="form-group">
                    {renderLabel('type', 'Type')}
                    <select
                      id={`${index}-type`}
                      className="form-control"
                      value={specificType}
                      onChange={event => this.inputChangeHandler(event, objKey, 'type')}
                    >
                      {this.state.controlTypes.map((type, indexType) => <option
                        key={indexType}>{type}</option>)}
                    </select>
                  </div>
                  {renderSpecificType()}
                </ElementEditModal>
              </div>
              <div className="vertical-center dform-input mr-0">
                <DependencyEditModal onOpen={this.uiSettingsOpen.bind(this, objKey)}
                                     onSave={this.uiSettingsSave.bind(this, 'fields', objKey)} onDelete={() => {
                  this.removePropertyField(objKey)
                }}>
                  <div className="">
                    <div className="col-md-12 form-group">
                      <label>Section</label>
                      <select
                        className="form-control"
                        value={this.state.uiSettings.section}
                        onChange={event => this.changeSection(event, objKey)}>
                        {Object.keys(this.state.uiSchema.onlySections).map((menuName, index) => <option
                          key={index}>{menuName}</option>)}
                      </select>
                    </div>
                    <div className="col-md-12 form-group">
                      <label>Group</label>
                      <select
                        className="form-control"
                        value={this.state.uiSettings.group}
                        onChange={event => this.changeGroup(event, objKey)}>
                        {Object.keys(this.state.uiSchema.sectionGroups)
                          .filter(group => this.state.uiSchema.sectionGroups[group] === this.state.uiSettings.section)
                          .map((group, index) => <option
                            key={index}>{group}</option>)}
                      </select>
                    </div>
                    <div className="col-md-12 form-group">
                      <label>Classes</label>
                      <select
                        className="form-control"
                        value={this.state.uiSettings.classes}
                        onChange={event => this.changeClasses(event, objKey)}>
                        {['', 'col-md-6', 'col-md-12'].map((col, index) => <option
                          key={index}>{col}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="border-top">
                    <div className="row"><h4 style={{margin: "15px auto"}}>Conditions</h4></div>
                    {dependencyFields}
                    {/* <div className="row m-2 float-right">
                                        <button type="submit" onClick={this.addConditional.bind(this, objKey)} className="btn btn-primary mt-2">Add condition</button>
                                    </div> */}
                    <div className="row m-2 mb-1">
                      <div className="form-create__add-new-group" onClick={this.addConditional.bind(this, objKey)}>
                        Add condition
                      </div>
                    </div>
                  </div>
                </DependencyEditModal>
              </div>
            </div>
          </div>
        </div>
      )
    });

    const getColumnClass = (key, element) => {
      let classes = [];
      classes.push(key in properties.uiSchema.columnsClasses ? properties.uiSchema.columnsClasses[key] : 'col-md-12');
      // classes.push(key in props.uiSchema.columnsClasses ? props.uiSchema.columnsClasses[key] : 'col-md-12');
      if(this.checkUiOptionField(element.name, 'label')) {
        classes.push('label-hide');
      }
      return classes.join(' ');
    };

    const elementsByGroups = () => {
      const groups = {};

      const groupedFields = Object.keys(this.state.uiSchema.groups);
      keys.forEach(elementKey => {
        properties[elementKey].content = {
          key: elementKey
        }
        if (groupedFields.indexOf(elementKey) !== -1) {
          const groupName = this.state.uiSchema.groups[elementKey];
          if (!Array.isArray(groups[groupName])) {
            groups[groupName] = [];
          }

          groups[groupName].push(properties[elementKey]);
        } else {
          if (!Array.isArray(groups[WITHOUT_GROUP + elementKey])) {
            groups[WITHOUT_GROUP + elementKey] = [];
          }

          groups[WITHOUT_GROUP + elementKey].push(properties[elementKey]);
        }
      });

      return groups;
    };

    const getUniqueValues = (notUniqArray) => {
      return notUniqArray.filter((value, index, arr) => arr.indexOf(value) === index);
    };

    const getSections = () => {
      const sections = Object.values(this.state.uiSchema.sections);
      return getUniqueValues(sections);
    };

    const isElementInSection = (elementContentKey, sectionName) => {
      return elementContentKey in this.state.uiSchema.sections && this.state.uiSchema.sections[elementContentKey] === sectionName;
    };
    const isSectionHaveOneElement = (elements, sectionName) => {
      const fieldsNames = elements.map(element => element.content.key);
      const found = fieldsNames.some(fieldName => isElementInSection(fieldName, sectionName));
      return !!found;
    };

    const renderElementsWithoutGroupsAndSections = () => {
      return Object.keys(groupedElements).map((groupName, index) => {

        if (groupName.indexOf('WITHOUT_GROUP') !== -1) {
          return groupedElements[groupName].map(element => {
            if (element.content.key in this.state.uiSchema.sections) {
              return null;
            }
            return renderConfigFields(element.content.key, index);
          });
        } else {
          return groupedElements[groupName].map(element => {
            if (element.content.key in this.state.uiSchema.sections) {
              return null;
            }
            return <Card key={groupName}>
              <CardHeader>{groupName}</CardHeader>
              <CardBody>
                {renderConfigFields(element.content.key, index)}
              </CardBody>
            </Card>;
          });
        }
      })
    }

    const renderElementsByGroupsAndSections = (sectionName) => {

      let groupedElementsKeys = Object.keys(groupedElements);

      return Object.keys(this.state.uiSchema.sectionGroups).map((groupName, index) => {
        if (groupedElementsKeys.indexOf(groupName) !== -1) {
          if (!isSectionHaveOneElement(groupedElements[groupName], sectionName)) {
            return null;
          }

          const elementContent = groupedElements[groupName].map(element => {

            if (isElementInSection(element.content.key, sectionName)) {
              return renderConfigFields(element.content.key, index);
              // return (<div className={getColumnClass(element.content.key)} key={element.content.key}>
              //     {element.content}
              // </div>)
            }
            return null;
          });

          if (groupName.indexOf('WITHOUT_GROUP') !== -1) {
            // todo
            // return <div key={`${sectionName}_${groupName}_${index}`} className="row ml-1 mt-2 mb-2">
            //     {elementContent}
            // </div>;
            return null;
          }

          return (
            <div className="border px-2" key={sectionName + '_' + groupName}>
              <div className="title pt-2 pb-0">
                                <span className="text-bold-500 font-medium-2 ml-50">
                                    {groupName}
                                  <div className="float-right">
                                        {this.modalEditDependencies('groups', groupName)}
                                    </div>
                                </span>
                <hr/>
              </div>
              <Row>
                {elementContent}
              </Row>
              <Row>
                <Col md="12">
                  <div className="form-group pull-right-icons">
                    <select
                      className="form-control"
                      value={this.state.type}
                      onChange={(event) => this.setState({type: event.target.value})}>
                      {this.state.controlTypes.map((type, indexType) => <option
                        key={indexType}>{type}</option>)}
                    </select>
                  </div>
                  <div className="d-flex dform-input-setting">
                    <div className="vertical-center dform-input">
                      <Plus size={20} onClick={() => this.addControl(sectionName, groupName)}
                            className="cursor-pointer"/>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )
        }

        if (this.state.uiSchema.sectionGroups[groupName] !== sectionName) return null;

        return <div className="border px-2 form-create__group-min-height " key={sectionName + '_' + groupName}>
          <div className="title pt-2 pb-0">
                        <span className="text-bold-500 font-medium-2 ml-50">
                            {groupName}
                          <div className="float-right">
                                {this.modalEditDependencies('groups', groupName)}
                            </div>
                        </span>
            <hr/>
          </div>
          <Row>

            <Col md="12">
              <div className="form-group pull-right-icons">
                <select
                  className="form-control"
                  value={this.state.type}
                  onChange={(event) => this.setState({type: event.target.value})}>
                  {this.state.controlTypes.map((type, indexType) => <option
                    key={indexType}>{type}</option>)}
                </select>
              </div>
              <div className="d-flex dform-input-setting">
                <div className="vertical-center dform-input">
                  <Plus size={20} onClick={() => this.addControl(sectionName, groupName)} className="cursor-pointer"/>
                </div>
              </div>
            </Col>

          </Row>
        </div>
      });
    };

    const renderElementsWithNoGroupsAndSections = (sectionName) => {

      return Object.keys(groupedElements).map((groupName, index) => {

        if (!isSectionHaveOneElement(groupedElements[groupName], sectionName)) {
          return null;
        }

        if (groupName.indexOf('WITHOUT_GROUP') === -1) {
          // todo
          // return <div key={`${sectionName}_${groupName}_${index}`} className="row ml-1 mt-2 mb-2">
          //     {elementContent}
          // </div>;
          return null;
        }
        const elementContent = groupedElements[groupName].map(element => {

          if (isElementInSection(element.content.key, sectionName)) {
            return renderConfigFields(element.content.key, index);
            // return (<div className={getColumnClass(element.content.key)} key={element.content.key}>
            //     {element.content}
            // </div>)
          }
          return null;
        });


        return elementContent
      })
    };

    const sections = getSections();
    const onlySections = Object.keys(this.state.uiSchema.onlySections)
    const groupedElements = elementsByGroups();


    const defaultTab = sections.length && this.state.tabConfig === -1 ? 1 : this.state.tabConfig;

    const renderObject = () => {
      return (<div>
        <Row>
          {renderElementsWithoutGroupsAndSections()}
        </Row>

        <Nav tabs className="mt-1 border mb-0">
          {
            onlySections.map((section, index) =>
              <NavItem key={section}>
                <NavLink
                  className={classnames({
                    active: this.state.tabConfig == index
                  })}
                  onClick={() => {
                    this.setState({tabConfig: index})
                  }}
                >
                  <span className="align-middle ml-50">{section}</span>
                  <div className="ml-1 float-right">
                    {this.modalEditDependencies('sections', section)}
                  </div>
                </NavLink>
              </NavItem>
            )
          }
          <NavItem className="border">
            <NavLink
              onClick={() => {
                this.addNewSection()
              }}
            >
              <span className="align-middle ml-50 primary">Add tab</span>
              <div className="ml-1 float-right">
                <Plus size={20} className="cursor-pointer primary"/>
              </div>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.tabConfig} className="border form-create__tab-min-height">
          {
            onlySections.map((section, index) =>
              <TabPane tabId={index} key={section}>
                <Row className="mx-0" col="12">
                  <Col className="p-0" sm="12">
                    {
                      renderElementsByGroupsAndSections(section)
                    }
                    <div className="form-create__add-new-group" onClick={() => this.addNewGroup(section)}>
                      Add group
                    </div>
                  </Col>
                </Row>
                <Row className="mt-1 mb-1">
                  {renderElementsWithNoGroupsAndSections(section)}
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


  addOperatorField = (conditionFieldType, index) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[index][conditionFieldType].push({
      "field": "text",
      "operator": "=",
      "value": ""
    });
    this.setState(state);
  }

  addConditionField = (conditionFieldType, index) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[index][conditionFieldType].push('');
    this.setState(state);
  }

  setConditionalField = (event, conditionFieldType, indexCondition, indexField) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[indexCondition][conditionFieldType][indexField] = event.target.value;
    this.setState(state);
  }

  addNewSection() {
    let state = clone(this.state);
    let sectionName = 'Tab ' + (Object.keys(this.state.uiSchema.onlySections).length + 1);
    if (sectionName in state.uiSchema.onlySections) {
      sectionName += this.makeid(9);
    }
    state.uiSchema.onlySections[sectionName] = true;

    this.setState(state);
  }

  addNewGroup(section) {
    let state = clone(this.state);
    let groupName = 'Group ' + (Object.keys(this.state.uiSchema.sectionGroups).length + 1);
    if (groupName in state.uiSchema.sectionGroups) {
      groupName += this.makeid(9);
    }
    state.uiSchema.sectionGroups[groupName] = section;
    this.setState(state);
  }

  setOperatorField = (event, conditionFieldType, indexCondition, indexField, operatorKey) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[indexCondition][conditionFieldType][indexField][operatorKey] = event.target.value;
    this.setState(state);
  };

  removeUiEffects = (state, dependencyType, objKey) => {

    state.uiSchema.sectionStates = {};

    state.uiSchema.groupStates = {};

    Object.keys(state.schema.properties).forEach(field => {
      delete state.uiSchema[field];
    });
  };

  setConditionalEffect = (event) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.effect = event.target.value;

    this.setState(state);
  };

  removeConditionalField = (event, conditionFieldType, indexCondition, indexField) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[indexCondition][conditionFieldType].splice(indexField, 1);
    this.setState(state);
  };

  removeConditional = (event, indexCondition) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions.splice(indexCondition, 1);
    this.setState(state);
  };

  addConditional = (objKey) => {
    let state = clone(this.state);

    if (Object.keys(state.uiSettings.dependencies).length) {
      state.uiSettings.dependencies.conditions.push({
        "type": "validation",
        "fields": [],
        "groups": [],
        "sections": [],
        "fieldOperators": []
      });
    } else {
      state.uiSettings.dependencies = {
        "conditions": [
          {
            "type": "validation",
            "fields": [],
            "groups": [],
            "sections": [],
            "fieldOperators": []
          }
        ],
        "effect": "disabled"
      }
    }

    this.setState(state);
  };

  dependecyModalSave = (dependencyType, objKey) => {
    let state = clone(this.state);
    this.changeNameByDependencyType(objKey, dependencyType, state);
    this.removeUiEffects(state, dependencyType, objKey);
    state.uiSchema.dependencies[dependencyType][objKey] = clone(state.uiSettings.dependencies);
    this.dependencyChecker(state);
    this.setState(state);
  };

  dependencyModalOpen = (dependencyType, objKey) => {
    let dependencies = objKey in this.state.uiSchema.dependencies[dependencyType] ? this.state.uiSchema.dependencies[dependencyType][objKey] : {}
    this.setState({fieldEdit: {propertyKey: objKey}})
    this.setState({
      uiSettings: {
        classes: '',
        group: '',
        section: '',
        dependencies: dependencies
      }
    });
  };

  uiSettingsSave = (dependencyType, objKey) => {
    let state = clone(this.state);

    if (this.state.uiSettings.classes) {
      state.uiSchema.columnsClasses[objKey] = this.state.uiSettings.classes;
    } else {
      delete state.uiSchema.columnsClasses[objKey];
    }
    if (this.state.uiSettings.group) {
      state.uiSchema.groups[objKey] = this.state.uiSettings.group;
    } else {
      delete state.uiSchema.groups[objKey];
    }
    if (this.state.uiSettings.section) {
      state.uiSchema.sections[objKey] = this.state.uiSettings.section;
    } else {
      delete state.uiSchema.sections[objKey];
    }

    // todo duplicate with dependecyModalSave
    this.removeUiEffects(state, dependencyType, objKey);
    state.uiSchema.dependencies.fields[objKey] = clone(state.uiSettings.dependencies);
    this.dependencyChecker(state);

    this.setState(state);
  };

  uiSettingsOpen = (objKey) => {
    let classes = objKey in this.state.uiSchema.columnsClasses ? this.state.uiSchema.columnsClasses[objKey] : ''
    let section = objKey in this.state.uiSchema.sections ? this.state.uiSchema.sections[objKey] : ''
    let group = objKey in this.state.uiSchema.groups ? this.state.uiSchema.groups[objKey] : ''
    let dependencies = objKey in this.state.uiSchema.dependencies.fields ? this.state.uiSchema.dependencies.fields[objKey] : {}
    this.setState({
      uiSettings: {
        classes: classes,
        group: group,
        section: section,
        dependencies: dependencies
      }
    });
  };

  changeClasses = (event, objKey) => {
    let state = clone(this.state);
    if (event.target.value) {
      state.uiSettings.classes = event.target.value;
    } else {
      state.uiSettings.classes = '';
    }
    this.setState(state);
  };

  changeGroup = (event, objKey) => {
    let state = clone(this.state);
    if (event.target.value) {
      state.uiSettings.group = event.target.value;
    } else {
      state.uiSettings.group = ''
    }
    this.setState(state);
  };

  changeSection = (event, objKey) => {
    let state = clone(this.state);
    if (event.target.value) {
      state.uiSettings.section = event.target.value;
    } else {
      state.uiSettings.section = '';
    }

    this.setState(state);
  };

  submitDForm() {
    let schema = {
      schema: this.state.schema,
      // uiSchema: {
      //     sections: this.state.uiSchema.sections,
      //     groups: this.state.uiSchema.groups,
      //     onlySections: this.state.uiSchema.onlySections,
      //     groupStates: {},
      //     sectionStates: {},
      //     sectionGroups: this.state.uiSchema.sectionGroups,
      //     dependencies: this.state.uiSchema.dependencies,
      //     columnsClasses: this.state.uiSchema.columnsClasses,
      // },
      uiSchema: this.state.uiSchema
    };
    let dForm = clone(this.state.dFormTemplate);
    dForm.schema = schema;
    this.props.submitDForm(dForm, this.state.additionalData);
  }

  deleteGroupOrSection(type, previousFieldKey, stateOut = false) {
    if (type === 'sections') {

      let state = stateOut || clone(this.state);

      Object.keys(state.uiSchema.sectionGroups).forEach((groupInSection) => {
        if (state.uiSchema.sectionGroups[groupInSection] === previousFieldKey) {
          this.deleteGroupOrSection('groups', groupInSection, state);
        }
      });

      //onlySections
      //sections

      // dependencies for fields

      let onlySectionTemp = {};
      Object.keys(state.uiSchema.onlySections).forEach((sectionName) => {
        if (previousFieldKey === sectionName) {
          return;
        }
        onlySectionTemp[sectionName] = state.uiSchema.onlySections[previousFieldKey];
      });
      state.uiSchema.onlySections = onlySectionTemp;

      Object.keys(state.uiSchema.sections).forEach((fieldName) => {
        if (state.uiSchema.sections[fieldName] === previousFieldKey) {
          delete state.uiSchema.sections[fieldName];
        }
      });

      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (state.uiSchema.sectionGroups[groupName] === previousFieldKey) {
          delete state.uiSchema.sectionGroups[groupName];
        }
      });

      if (previousFieldKey in state.uiSchema.dependencies.sections) {
        delete state.uiSchema.dependencies.sections[previousFieldKey];
      }

      const dependencyTypes = ['fields', 'groups', 'sections'];

      dependencyTypes.forEach(dependencyType => {

        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            'conditions' in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[dependencyType][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.sections.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.sections.splice(previousIndexFieldKey, 1);
              }
              // groups
              // sections
              return condition;
            })
          }
        });
      });

      this.setState(state);
    }
    if (type === 'groups') {

      let state = stateOut || clone(this.state);

      Object.keys(state.uiSchema.groups).forEach((fieldKeyInGroup) => {
        if (state.uiSchema.groups[fieldKeyInGroup] === previousFieldKey) {
          this.removePropertyField(fieldKeyInGroup, state);
        }
      });

      // dependencies for fields

      Object.keys(state.uiSchema.groups).forEach((fieldName) => {
        if (state.uiSchema.groups[fieldName] === previousFieldKey) {
          delete state.uiSchema.groups[fieldName];
        }
      });

      let onlySectionGroups = {};
      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (previousFieldKey === groupName) {
          return;
        }
        onlySectionGroups[groupName] = state.uiSchema.sectionGroups[groupName];
      });
      state.uiSchema.sectionGroups = onlySectionGroups;

      if (previousFieldKey in state.uiSchema.dependencies.groups) {
        delete state.uiSchema.dependencies.groups[previousFieldKey];
      }

      const dependencyTypes = ['fields', 'groups', 'sections'];

      dependencyTypes.forEach(dependencyType => {

        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            'conditions' in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[dependencyType][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.groups.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.groups.splice(previousIndexFieldKey, 1);
              }
              // groups
              // sections
              return condition;
            })
          }
        });
      })

      this.setState(state);
    }
  }

  changeNameByDependencyType(previousFieldKey, dependencyType, stateOut = false) {
    if (dependencyType === 'sections') {
      const newFieldKey = this.state.fieldEdit.propertyKey

      if (newFieldKey === previousFieldKey) return;

      let state = stateOut || clone(this.state);
      //onlySections
      //sections

      // dependencies for fields

      let onlySectionTemp = {};
      Object.keys(state.uiSchema.onlySections).forEach((sectionName) => {
        if (previousFieldKey === sectionName) {
          onlySectionTemp[newFieldKey] = state.uiSchema.onlySections[previousFieldKey];
          return;
        }
        onlySectionTemp[sectionName] = state.uiSchema.onlySections[previousFieldKey];
      });
      state.uiSchema.onlySections = onlySectionTemp;

      Object.keys(state.uiSchema.sections).forEach((fieldName) => {
        if (state.uiSchema.sections[fieldName] === previousFieldKey) {
          state.uiSchema.sections[fieldName] = newFieldKey;
        }
      });

      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (state.uiSchema.sectionGroups[groupName] === previousFieldKey) {
          state.uiSchema.sectionGroups[groupName] = newFieldKey;
        }
      });

      if (previousFieldKey in state.uiSchema.dependencies.sections) {
        state.uiSchema.dependencies.sections[newFieldKey] = state.uiSchema.dependencies.sections[previousFieldKey];
        delete state.uiSchema.dependencies.sections[previousFieldKey];
      }

      const dependencyTypes = ['fields', 'groups', 'sections'];

      dependencyTypes.forEach(dependencyType => {

        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            'conditions' in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[dependencyType][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.sections.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.sections.splice(previousIndexFieldKey, 1);
                condition.sections.push(newFieldKey)
              }
              // groups
              // sections
              return condition;
            })
          }
        });
      })

      this.setState(state);
    }
    if (dependencyType === 'groups') {
      const newFieldKey = this.state.fieldEdit.propertyKey;

      if (newFieldKey === previousFieldKey) return;

      let state = stateOut || clone(this.state);

      // dependencies for fields

      Object.keys(state.uiSchema.groups).forEach((fieldName) => {
        if (state.uiSchema.groups[fieldName] === previousFieldKey) {
          state.uiSchema.groups[fieldName] = newFieldKey;
        }
      });

      let onlySectionGroups = {};
      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (previousFieldKey === groupName) {
          onlySectionGroups[newFieldKey] = state.uiSchema.sectionGroups[previousFieldKey];
          return;
        }
        onlySectionGroups[groupName] = state.uiSchema.sectionGroups[groupName];
      });
      state.uiSchema.sectionGroups = onlySectionGroups;


      if (previousFieldKey in state.uiSchema.dependencies.groups) {
        state.uiSchema.dependencies.groups[newFieldKey] = state.uiSchema.dependencies.groups[previousFieldKey];
        delete state.uiSchema.dependencies.groups[previousFieldKey];
      }

      const dependencyTypes = ['fields', 'groups', 'sections'];

      dependencyTypes.forEach(dependencyType => {

        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            'conditions' in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[dependencyType][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.groups.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.groups.splice(previousIndexFieldKey, 1);
                condition.groups.push(newFieldKey)
              }
              // groups
              // sections
              return condition;
            })
          }
        });
      })

      this.setState(state);
    }
  }

  renderDependencyPart = (dependencyType, objKey) => {
    let dependencyFields = null;

    if (Object.keys(this.state.uiSettings.dependencies).length) {

      dependencyFields = this.state.uiSettings.dependencies.conditions.map((condition, index) => {
        return (
          <Card className="mt-1" key={index}>
            <CardHeader>
              <CardTitle>
                Condition
              </CardTitle>

              {/* <button onClick={event => this.removeConditional(event, index)} type="submit" className="btn btn-danger float-right">Remove</button> */}
              <X size={15} className="cursor-pointer mr-1" onClick={event => this.removeConditional(event, index)}/>
            </CardHeader>
            <CardBody>
              <hr/>
              {
                dependencyType === 'sections' ?
                  <div>
                    <label>Sections</label>
                    {
                      condition.sections.map((condition, indexField) => {
                        return (<div className="row ml-2 mt-1" key={index + '_' + indexField}>
                          <div className="col-md-10">
                            <select
                              className="form-control"
                              value={condition}
                              onChange={event => this.setConditionalField(event, 'sections', index, indexField)}
                            >
                              <option key="-1"></option>
                              {this.getSections().map((type, indexType) => <option
                                key={index + '_' + indexField + '_' + indexType}>{type}</option>)}
                            </select>
                          </div>
                          <div className="vertical-center dform-input">
                            <X size={15} className="cursor-pointer mr-1"
                               onClick={event => this.removeConditionalField(event, 'sections', index, indexField)}/>
                          </div>
                        </div>)
                      })
                    }
                    <div className="row m-2">
                      <div className="form-create__add-new-group small"
                           onClick={this.addConditionField.bind(this, 'sections', index)}>
                        Add section
                      </div>
                    </div>
                  </div>
                  : null
              }
              <div>
                <label>Groups</label>

                {
                  condition.groups.map((condition, indexField) => {
                    return (<div className="row mt-1 ml-2" key={indexField}>
                      <div className="col-md-10">
                        <select
                          className="form-control"
                          value={condition}
                          onChange={event => this.setConditionalField(event, 'groups', index, indexField)}
                        >
                          <option key="-1"></option>
                          {this.getGroups().map((type, indexType) => <option
                            key={indexType}>{type}</option>)}
                        </select>
                      </div>

                      <div className="vertical-center dform-input">
                        <X size={15} className="cursor-pointer mr-1"
                           onClick={event => this.removeConditionalField(event, 'groups', index, indexField)}/>
                      </div>
                    </div>)
                  })
                }
                <div className="row m-2">
                  <div className="form-create__add-new-group small"
                       onClick={this.addConditionField.bind(this, 'groups', index)}>
                    Add group
                  </div>
                </div>
              </div>
              <div>
                <label>Fields</label>
                {
                  condition.fields.map((condition, indexField) => {
                    return (<div className="row mt-1 ml-2" key={indexField}>
                      <div className="col-md-10">
                        <select
                          className="form-control"
                          value={condition}
                          onChange={event => this.setConditionalField(event, 'fields', index, indexField)}
                        >
                          <option key="-1"></option>
                          {Object.keys(this.state.schema.properties).filter(nextFilterField => nextFilterField !== objKey).map((type, indexType) =>
                            <option
                              key={indexType}>{type}</option>)}
                        </select>
                      </div>

                      <div className="vertical-center dform-input">
                        <X size={15} className="cursor-pointer mr-1"
                           onClick={event => this.removeConditionalField(event, 'fields', index, indexField)}/>
                      </div>
                    </div>)
                  })
                }
                <div className="row m-2">
                  <div className="form-create__add-new-group small"
                       onClick={this.addConditionField.bind(this, 'fields', index)}>
                    Add field
                  </div>
                </div>
              </div>
              <div>
                <label>Field operator</label>
                {condition.fieldOperators.length ?

                  condition.fieldOperators.map((fieldOperator, indexFieldOperator) => {
                    return (<div className="row mt-1 ml-2" key={indexFieldOperator}>
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          onChange={event => this.setOperatorField(event, 'fieldOperators', index, indexFieldOperator, 'field')}
                          value={fieldOperator.field}
                        >
                          <option key="-1"></option>
                          {Object.keys(this.state.schema.properties).filter(nextFilterField => nextFilterField !== objKey).map((type, indexType) =>
                            <option
                              key={indexType}>{type}</option>)}
                        </select>
                      </div>

                      <div className="col-md-3">
                        <select
                          className="form-control"
                          onChange={event => this.setOperatorField(event, 'fieldOperators', index, indexFieldOperator, 'operator')}
                          value={fieldOperator.operator}
                        >
                          <option key="-1"></option>
                          {['>', '<', '=', '!='].map((type, indexType) => <option
                            key={indexType}>{type}</option>)}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <input type="text"
                               onChange={event => this.setOperatorField(event, 'fieldOperators', index, indexFieldOperator, 'value')}
                               value={fieldOperator.value}
                               className="form-control"/>
                      </div>

                      <div className="vertical-center dform-input">
                        <X size={15} className="cursor-pointer mr-1"
                           onClick={event => this.removeConditionalField(event, 'fieldOperators', index, indexFieldOperator)}/>
                      </div>
                    </div>)
                  })
                  : null
                }
                <div className="row m-2">
                  <div className="form-create__add-new-group small"
                       onClick={this.addOperatorField.bind(this, 'fieldOperators', index)}>
                    Add operator
                  </div>
                </div>
              </div>
              <div>
                <label>Default state (Effect)</label>
                <select
                  className="form-control"
                  value={this.state.uiSettings.dependencies.effect}
                  onChange={event => this.setConditionalEffect(event)}
                >
                  {this.getEffects().map((type, indexType) => <option
                    key={indexType}>{type}</option>)}
                </select>

              </div>

              {/* <div className="row">
                                <div className="col-md-12">
                                    {
                                        dependencyType === 'sections' ?
                                            <button type="submit" onClick={this.addConditionField.bind(this, 'sections', index)} className="btn btn-primary mt-3 ml-3 float-right">Add section</button>
                                            : null
                                    }
                                    <button type="submit" onClick={this.addConditionField.bind(this, 'groups', index)} className="btn btn-primary mt-3 ml-3 float-right">Add group</button>
                                    <button type="submit" onClick={this.addConditionField.bind(this, 'fields', index)} className="btn btn-primary mt-3 ml-3 float-right">Add field</button>
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" onClick={this.addOperatorField.bind(this, 'fieldOperators', index)} className="btn btn-primary mt-3 ml-3 float-right">Add operator</button>
                                </div>
                            </div> */}
            </CardBody>
          </Card>
        );
      })
    }

    return dependencyFields;
  };

  modalEditDependencies = (dependencyType, objKey) => {

    const dependencyFields = this.renderDependencyPart(dependencyType, objKey);

    return (
      <DependencyEditModal onOpen={() => this.dependencyModalOpen(dependencyType, objKey)}
                           onSave={() => this.dependecyModalSave(dependencyType, objKey)} onDelete={() => {
        this.deleteGroupOrSection(dependencyType, objKey)
      }}>
        <div className="row" key={objKey}>
          <div className="col-md-12 form-group">
            <input id={`${objKey}`}
                   value={this.state.fieldEdit.propertyKey}
                   type="text"
              // ref={this.refTitles}
                   data-id={objKey}
                   onChange={event => this.setState({fieldEdit: {propertyKey: event.target.value}})}
                   className="form-control"
                   placeholder="Name"/>
            {/* <Button disabled={this.state.fieldEdit.propertyKey === objKey ? true : false}
                            // onClick={this.inputKeyObjectHandler.bind(this, objKey)}
                            onClick={() => this.changeNameByDependencyType(objKey, dependencyType)}
                            type="submit"
                            color={(this.state.fieldEdit.propertyKey === objKey ? 'light' : 'primary')}>Save</Button> */}
          </div>
        </div>
        <div className="border-top">
          <div className="row"><h4 style={{margin: "15px auto"}}>Conditions</h4></div>
          {dependencyFields}
          <div className="row m-2">
            {/* <button type="submit" onClick={this.addConditional.bind(this, dependencyType, objKey)} className="btn btn-primary mt-2">Add condition</button> */}
            <div className="form-create__add-new-group"
                 onClick={this.addConditional.bind(this, dependencyType, objKey)}>
              Add condition
            </div>
          </div>
        </div>
      </DependencyEditModal>
    )
  };

  getUniqueValues = (notUniqArray) => {
    return notUniqArray.filter((value, index, arr) => arr.indexOf(value) === index);
  };

  getSections = () => {
    const sections = Object.values(this.state.uiSchema.sections);
    return this.getUniqueValues(sections);
  };

  getGroups = () => {
    const groups = Object.values(this.state.uiSchema.groups);
    return this.getUniqueValues(groups);
  };

  onSave() {
    this.props.onSave && this.props.onSave(this.state.formData);
  }

  render() {

    let controls = this.getListControls(this.state.schema.properties);
    const options = {
      selectOnLineNumbers: true
    };

    return (
      <Row>
        {
          this.props.isStateConfig ?
            <Col>
              {/*
                            <div className="form-group border-bottom">
                                <label>Head title</label>
                                <input value={this.state.schema.title} onChange={this.handleTitleChange.bind(this)} type="text"
                                    className="form-control" />
                            </div>
                            <div className="form-group border-bottom">
                                <label>Head title</label>
                                <input value={this.state.schema.title} onChange={this.handleTitleChange.bind(this)} type="text"
                                    className="form-control" />
                            </div> */}
              <div className="form-group border-bottom">
                <label>Name</label>
                <input value={this.state.additionalData.name} onChange={(event) => {
                  this.setState({additionalData: {...this.state.additionalData, name: event.target.value}})
                }} type="text"
                       className="form-control"/>
              </div>
              <div className="form-group border-bottom">
                <label>Description</label>
                <input value={this.state.additionalData.description} onChange={(event) => {
                  this.setState({additionalData: {...this.state.additionalData, description: event.target.value}})
                }} type="text"
                       className="form-control"/>
              </div>
              <div className="">
                {controls}
              </div>
              <Row>
                {/* <Col md="6">
                                    <select
                                        className="form-control"
                                        value={this.state.type}
                                        onChange={(event) => this.setState({ type: event.target.value })}>
                                        {this.state.controlTypes.map((type, indexType) => <option
                                            key={indexType}>{type}</option>)}
                                    </select>
                                </Col>
                                <Col md="6">
                                    <button type="submit" onClick={this.addControl} className="btn btn-primary">Add field</button>
                                </Col> */}
                <Col md="12">
                  <div className="d-flex justify-content-center flex-wrap mt-2">
                    <Button color="primary d-flex-left" onClick={() => this.submitDForm()}>Save</Button>
                  </div>
                </Col>
              </Row>
            </Col>
            :
            <Col>
              <Form
                showErrorList={false}
                liveValidate={false}
                formData={this.state.formData}
                onSubmit={this.formSubmit}
                schema={this.state.schema}
                ObjectFieldTemplate={this.ObjectFieldTemplate}
                uiSchema={this.state.uiSchema}
                widgets={{
                  CheckboxWidget: this.CustomCheckbox,
                  CheckboxesWidget: this.CustomCheckboxes
                }}
                onChange={(event) => {
                  this.onChangeForm(event)
                }}
              >
                <div className="form-create__dform_actions pr-1">
                  {
                    this.state.onSaveButtonHidden ? null : <Button type="button" color="primary" onClick={() => {
                      this.onSave()
                    }}>Save</Button>
                  }
                  {
                    this.props.statusChanged ?

                      <div style={{width: '160px'}}>
                        <Select
                          className=""
                          classNamePrefix="select"
                          value={this.state.dFormSelectedAction}
                          options={this.state.dFormActions}
                          onChange={(value) => {
                            this.setSelectedDFormAction(value)
                          }}
                        />
                      </div>
                      : null
                  }
                  {
                    this.props.onSubmit ? <Button type="submit" color="primary">Submit</Button> : null
                  }
                </div>
              </Form>

            </Col>
        }
        {/* <div className="col-md-6 overflow-auto border-bottom" style={{ height: '600px' }}> </div> */}
      </Row>
    )
  }
}

export default FormCreate;
