import Checkbox from 'components/@vuexy/checkbox/CheckboxesVuexy';
import {Check, Plus} from 'react-feather';
import Constants from './Constants';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import ElementEditModal from '../ElementEditModal';
import DependencyEditModal from '../DependencyEditModal';
import {isEmpty} from 'lodash';
import classnames from 'classnames';
import React from 'react';
import {getSpecificType} from '../helper';
import WysiwygEditor from '../Custom/WysiwygEditor';
import MasterSchemaProperty from '../Fields/MasterSchemaProperty';
import MasterSchemaPropertyConfig from '../Fields/MasterSchemaPropertyConfig';
import ResourceManagerFieldFiles from "../Fields/ResourceManagerFieldFiles";

export function listControls(properties) {

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
      return (<MasterSchemaPropertyConfig
        readOnly={true} id={`${index}-${column}`}
        value={objKey} type="text"
        ref={this.refTitles}
        data-id={objKey}
        onChange={event => this.inputKeyObjectHandler(event, objKey)}
        className="form-control"
        placeholder={placeholder}/>)
    };

    const renderKeyObjectEditColumn = (column, placeholder) => {

      if (Constants.NOT_MASTER_SCHEMA_FIELDS.indexOf(schemaPropertyEdit?.type) !== -1) {
        return (<div>
            <label htmlFor={`${index}-property-${column}`}>Property name</label>
            <Input id={`${index}-property-${column}`}
                   value={this.state.fieldEdit.propertyKey}
                   type="text"
                   ref={this.refTitles}
                   data-id={objKey}
                   onChange={event => this.setState({
                     fieldEdit: {
                       ...this.state.fieldEdit,
                       propertyKey: event.target.value
                     }
                   })}
                   className="form-control"
                   placeholder={placeholder}
            />
          </div>
        );

      }

      return (
        <div>
          <MasterSchemaProperty
            onChangeFieldId={(fieldId) => {
              onChangeMasterSchemaProperty(fieldId)
            }}
            fieldId={schemaPropertyEdit.reference?.field_id}
            organizations={this.state.dFormTemplate.groups || []}
          />
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

    const renderEditor = (column, placeholder, inputType = "text", defaultValue = '') => {
      return (<WysiwygEditor
          id={`${index}-${column}`}
          type={inputType}
          data={column in schemaPropertyEdit ? schemaPropertyEdit[column] : defaultValue}
          onChange={event => this.wysiwygChange(event, objKey, column)}
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

    const renderReactSelectColumn = (column, options) => {
      // todo temporary select for one value
      return (<select
              id={`${index}-${column}`}
              className="form-control"
              value={schemaPropertyEdit[column]}
              onInput={event => this.inputChangeHandler(event, objKey, column)}
          >
              {
                  options.map(
                      (option, key) => <option key={key} value={option.value}>{option.label}</option>
                  )
              }
          </select>
      );
    };

    const renderRequiredColumn = (column) => {
      return (
        <div className="w-100">
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16}/>}
            label="Is required"
            id={`${index}-${column}`}
            onChange={() => {
              //this.inputHandlerRequired(event, this.state.fieldEdit.propertyKey);
              this.setState({fieldEdit: {...this.state.fieldEdit, isRequired: !this.state.fieldEdit.isRequired}});
            }}
            checked={this.state.fieldEdit.isRequired}
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
          onChange={() => this.setLabelShowingCheckbox()}
          checked={this.getLabelShowingCheckbox()}
        />
      </div>
    };

    const renderLabel = (column, text) => {
      return (<label htmlFor={`${index}-${column}`}>{text}</label>)
    };

    const specificType = getSpecificType(schemaPropertyEdit);

    const onChangeMasterSchemaProperty = (fieldId) => {
      this.changeMasterSchemaFieldId(fieldId);
      this.setState({fieldEdit: {...this.state.fieldEdit, propertyKey: fieldId}})
    };

    const renderNumberColumn = (column, text) => (
      <Col md="6">
        <FormGroup>
          {renderLabel(column, text)}
          {renderInputNumberColumn(column, text)}
        </FormGroup>
      </Col>
    );

    const renderRequiredAndLabelShowCheckboxes = () => (
      <>
        <Col md="12">
          <FormGroup>
            {renderRequiredColumn(objKey)}
          </FormGroup>
        </Col>
        <Col md="12">
          <FormGroup>
            {renderLabelShowing(objKey)}
          </FormGroup>
        </Col>
      </>
    );

    const onChangeResourceManagerFieldFile = (resourceManagerFieldId) => {
        this.setState({schemaPropertyEdit: {...this.state.schemaPropertyEdit, resource_manager_field_id: resourceManagerFieldId}})
    }

    const renderSpecificType = () => {

      let labelForControls = <div>
        {renderLabel('title', 'Title')}
        <div className="form-group">
          {renderInputColumn('title', 'Title')}
        </div>
      </div>;

      switch (specificType) {
        // case Constants.FIELD_TYPE_REFERENCE: {
        //   // todo make constant fieldId
        //   return (
        //     <MasterSchemaField onChangeFieldId={onChangeFieldId} fieldId={schemaPropertyEdit.field_id}/>
        //   );
        // }
        case Constants.FIELD_TYPE_TEXT: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>
              {renderNumberColumn("minLength", "Min Length")}
              {renderNumberColumn("maxLength", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </Row>
          );
        }
        case Constants.FIELD_TYPE_NUMBER: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>

              {renderNumberColumn("minimum", "Min Length")}
              {renderNumberColumn("maximum", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </Row>
          );
        }
        case Constants.FIELD_TYPE_FILE: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>

              {renderRequiredAndLabelShowCheckboxes()}
            </Row>
          );
        }
        case Constants.FIELD_TYPE_RESOURCE: {
          return (
            <Row>
              <Col md="12">
                <FormGroup>
                  {renderLabel('resource_manager_field_id', 'Resource link')}
                  <ResourceManagerFieldFiles
                    organizations={this.state.dFormTemplate.groups || []}
                    resourceManagerFieldId={schemaPropertyEdit['resource_manager_field_id']}
                    onChange={(event) => onChangeResourceManagerFieldFile(event.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  {renderLabel('action', 'Compile option')}
                  {renderReactSelectColumn('action', [
                    {value: 'default', label: 'Compile on dForm association'},
                  ])}
                </FormGroup>
              </Col>
              <Col md="12">
                {labelForControls}
              </Col>
              <Col md="12">
                <FormGroup>
                  {renderLabelShowing(objKey, 'Required?')}
                </FormGroup>
              </Col>
            </Row>
          );
        }
        case Constants.FIELD_TYPE_FILE_LIST: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>

              {renderRequiredAndLabelShowCheckboxes()}
            </Row>
          );
        }
        case Constants.FIELD_TYPE_BOOLEAN: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>

              {renderRequiredAndLabelShowCheckboxes()}
            </Row>
          );
        }
        case Constants.FIELD_TYPE_TEXT_AREA: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>

              {renderNumberColumn("minLength", "Min Length")}
              {renderNumberColumn("maxLength", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </Row>
          );
        }
        case Constants.FIELD_TYPE_LONG_TEXT_AREA: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>

              {renderNumberColumn("minLength", "Min Length")}
              {renderNumberColumn("maxLength", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </Row>
          );
        }
        case Constants.FIELD_TYPE_DATE: {
          return (<div>
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>
            </Row>

            {renderLabel('format', 'Format')}
            {renderSelectColumn('format', ['date', 'date-time'])}

            {renderRequiredAndLabelShowCheckboxes()}
          </div>)
        }
        case Constants.FIELD_TYPE_SELECT: {
          return (<div>
            <Row>
              <Col md="12">
                {labelForControls}
              </Col>
            </Row>

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

            {renderRequiredAndLabelShowCheckboxes()}
          </div>)
        }
        case Constants.FIELD_TYPE_MULTI_SELECT: {
          return (<div>
            <div className="row" key={index}>
              <Col md="12">
                {labelForControls}
              </Col>

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
                      <div className="col-md-10 form-group">
                        <input
                          id={`${index}-`}
                          value={multiSelectObj.title}
                          type="text"
                          onChange={event => this.setMultiSelectTitleAndValue(event, objKey, index)}
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

              {renderRequiredAndLabelShowCheckboxes()}
            </div>
          </div>)
        }
        case Constants.FIELD_TYPE_HELP_TEXT: {
          return (<div>
            <FormGroup>
              {renderEditor('description', 'Description')}
            </FormGroup>
          </div>)
        }
        default:
          return (<div />)
      }
    };

    let dependencyFields = this.renderDependencyPart('fields', objKey);
    let currentSpecificType = getSpecificType(this.state.schema.properties[objKey]);


    const renderPropertyKey = () => {
      return <React.Fragment>
        {/*{renderLabel('property-' + objKey, 'Property')}*/}
        <div className="form-group">
          {renderKeyObjectEditColumn(objKey, 'Property')}
        </div>
      </React.Fragment>
    };

    return (
      <div
        className={objKey in this.state.uiSchema.columnsClasses ? this.state.uiSchema.columnsClasses[objKey] : 'col-md-12'}
        key={'control-edit-' + objKey + '-' + index}>
        {this.state.schema.properties[objKey].title ? renderLabel('property-' + objKey, this.state.schema.properties[objKey].title) : 'Empty title'}
        <div className="form-group position-relative">
          <div className="pull-right-icons position-relative">

            {renderKeyObjectColumn('property-' + objKey, 'Property')}
            <Badge color="primary position-absolute dform-type-badget">{currentSpecificType}</Badge>
          </div>

          <div className="d-flex dform-input-setting">
            <div className="vertical-center dform-input">
              <ElementEditModal onOpen={() => this.elementEditModalOpened(objKey)}
                                onSave={() => this.elementEditModalSave(objKey)}>

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
                {renderPropertyKey()}
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
                <div className="col-md-12 form-group">
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16}/>}
                    label="is protected"
                    onChange={event => {
                      this.setState({
                        uiSettings: {...this.state.uiSettings, protectedProperty: event.target.checked}
                      })
                    }}
                    checked={this.state.uiSettings.protectedProperty}
                  />
                </div>
                <div className="border-top">
                  <div className="row"><h4 style={{margin: "15px auto"}}>Conditions</h4></div>
                  {dependencyFields}
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

  const elementsByGroups = () => {
    const groups = {};

    const groupedFields = Object.keys(this.state.uiSchema.groups);
    keys.forEach(elementKey => {
      if (groupedFields.indexOf(elementKey) !== -1) {
        const groupName = this.state.uiSchema.groups[elementKey];
        if (isEmpty(groups[groupName])) {
          groups[groupName] = {};
        }

        groups[groupName][elementKey] = properties[elementKey];
      } else {
        if (isEmpty(groups[Constants.WITHOUT_GROUP + elementKey])) {
          groups[Constants.WITHOUT_GROUP + elementKey] = {};
        }

        groups[Constants.WITHOUT_GROUP + elementKey][elementKey] = properties[elementKey];
      }
    });

    return groups;
  };

  const isElementInSection = (elementContentKey, sectionName) => {
    return elementContentKey in this.state.uiSchema.sections && this.state.uiSchema.sections[elementContentKey] === sectionName;
  };
  const isSectionHaveOneElement = (elements, sectionName) => {
    const fieldsNames = Object.keys(elements);
    const found = fieldsNames.some(fieldName => isElementInSection(fieldName, sectionName));
    return !!found;
  };

  const renderElementsWithoutGroupsAndSections = () => {
    return Object.keys(groupedElements).map((groupName, index) => {

      if (groupName.indexOf('WITHOUT_GROUP') !== -1) {
        return Object.keys(groupedElements[groupName]).map((key) => {
          if (key in this.state.uiSchema.sections) {
            return null;
          }
          return renderConfigFields(key, index);
        });
      } else {
        return Object.keys(groupedElements[groupName]).map(key => {
          if (key in this.state.uiSchema.sections) {
            return null;
          }
          return <Card key={groupName}>
            <CardHeader>{groupName}</CardHeader>
            <CardBody>
              {renderConfigFields(key, index)}
            </CardBody>
          </Card>;
        });
      }
    })
  };

  const renderElementsByGroupsAndSections = (sectionName) => {

    let groupedElementsKeys = Object.keys(groupedElements);

    return Object.keys(this.state.uiSchema.sectionGroups).map((groupName, index) => {
      if (groupedElementsKeys.indexOf(groupName) !== -1) {
        if (!isSectionHaveOneElement(groupedElements[groupName], sectionName)) {
          return null;
        }
        let elementContent = Object.keys(groupedElements[groupName]);
        // todo ordering
        if (this.state.uiSchema.fieldsOrdering && this.state.uiSchema.fieldsOrdering.length) {
          const stringProps = elementContent.map(nextPropertyName => String(nextPropertyName));
          elementContent = this.state.uiSchema.fieldsOrdering.filter(elementName => stringProps.indexOf(String(elementName)) !== -1);
        }
        // todo end ordering


        elementContent = elementContent.map(key => {

          if (isElementInSection(key, sectionName)) {
            return renderConfigFields(key, index);
          }
          return null;
        });

        if (groupName.indexOf('WITHOUT_GROUP') !== -1) {
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
        return null;
      }

      return Object.keys(groupedElements[groupName]).map(key => {

        if (isElementInSection(key, sectionName)) {
          return renderConfigFields(key, index);
        }
        return null;
      })
    })
  };

  const onlySections = Object.keys(this.state.uiSchema.onlySections);
  const groupedElements = elementsByGroups();

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
                  // eslint-disable-next-line eqeqeq
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
