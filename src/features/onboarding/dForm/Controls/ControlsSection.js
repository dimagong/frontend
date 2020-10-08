import React from 'react'
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
  } from "reactstrap";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import {Check, Plus} from "react-feather";
import Constants from './utils/constants'
import ElementEditModal from './components/ElementEditModal'
import {getSpecificType} from "./utils/helper"
import DependencyEditModal from "./components/ElementEditModal"
import ControlTypeFactory from './ControlsTypeFactory';
import { useDispatch, useSelector } from "react-redux";
import { selectdForms, selectdForm } from "app/selectors/onboardingSelectors";

const ControlsSection = ({objKey, index, schemaPropertyEdit={}}) => {
  const dForm = useSelector(selectdForm);
  const {schema} = dForm;
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
  
      const renderLabel = (column, text) => {
        return (<label htmlFor={`${index}-${column}`}>{text}</label>)
      };
  
      const specificType = getSpecificType(schemaPropertyEdit);
  
  
      let dependencyFields = this.renderDependencyPart('fields', objKey);
  
      return (
        <div
          className={objKey in schema.uiSchema.columnsClasses ? schema.uiSchema.columnsClasses[objKey] : 'col-md-12'}
          key={'control-edit-' + objKey + '-' + index}>
          {schema.schema.properties[objKey].title ? renderLabel('property-' + objKey, schema.schema.properties[objKey].title) : 'Empty title'}
          <div className="form-group position-relative">
            <div className="pull-right-icons position-relative">
              {renderKeyObjectColumn('property-' + objKey, 'Property')}
              <Badge
                color="primary position-absolute dform-type-badget">{getSpecificType(this.state.schema.properties[objKey])}</Badge>
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
                  <ControlTypeFactory specificType={specificType} index={index} schemaPropertyEdit={schemaPropertyEdit} objKey={objKey}/>
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
}

export default ControlsSection
