import _ from "lodash";
import React from "react";
import Select from "react-select";
import { Check } from "react-feather";
import { Col, FormGroup, Row } from "reactstrap";

import { FIELD_TYPES } from "components/DForm/constants";
import Constants from "components/FormCreate/Parts/Constants";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import WysiwygEditor from "components/FormCreate/Custom/WysiwygEditor";
import MasterSchemaProperty from "components/FormCreate/Fields/MasterSchemaProperty";
import FieldLabel from "components/DForm/Components/Fields/Components/DFormWidgets/Components/FieldLabel";
import { colourStyles } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";

import {
  DATE_WIDGET_FORMATS,
  FIELD_INITIAL_SPECIFIC_PROPERTIES,
  FIELD_SPECIFIC_UI_STYLE_PROPERTIES,
  FIELDS_NOT_RELATED_TO_MASTER_SCHEMA,
} from "../../../../../../constants";

const FieldProperties = ({ element, onElementChange, organization, data, onFieldGroupChange }) => {
  const handleTypeChange = (e) => {
    // Might be some problems in future with nested objects

    const fieldType = e.value;

    onElementChange(
      _.merge(FIELD_INITIAL_SPECIFIC_PROPERTIES[fieldType], FIELD_SPECIFIC_UI_STYLE_PROPERTIES[fieldType], {
        ...element,
        type: fieldType,
      })
    );
  };

  const handleFieldGroupChange = (value) => {
    onFieldGroupChange(element.id, element.groupId, value.value);
  };

  const handleChange = (property, value) => {
    onElementChange({ ...element, [property]: value });
  };

  const onChangeMasterSchemaProperty = (fieldId) => {
    handleChange("masterSchemaPropertyId", fieldId);
  };

  const renderConfigFields = (objKey, index) => {
    // add collback for inputHandlerRequired and custom changes
    const renderInputNumberColumn = (column, placeholder, label, defaultValue = 0) => {
      // return (
      //   <input
      //     id={`${index}-${column}`}
      //     // value={""}
      //     type="number"
      //     onChange={() => {}}
      //     className="form-control"
      //     placeholder={placeholder}
      //   />
      // );

      return (
        <div className={"custom-form-filed form-create_custom-text-widget"}>
          <FieldLabel label={label} />
          <input
            id={`${index}-${column}`}
            type={"number"}
            disabled={false}
            value={element[column]}
            onChange={(e) => handleChange(column, e.target.value)}
            placeholder={placeholder}
          />
        </div>
      );
    };

    const renderInputColumn = (column, placeholder, label, inputType = "text", defaultValue = "") => {
      // return (
      //   <input
      //     id={`${index}-${column}`}
      //     value={element[column]}
      //     type={inputType}
      //     onChange={(e) => handleChange(column, e.target.value)}
      //     className="form-control"
      //     placeholder={placeholder}
      //   />
      // );

      return (
        <div className={"custom-form-filed form-create_custom-text-widget"}>
          <FieldLabel label={label} />
          <input
            id={`${index}-${column}`}
            type={"text"}
            disabled={false}
            value={element[column]}
            onChange={(e) => handleChange(column, e.target.value)}
            placeholder={placeholder}
          />
        </div>
      );
    };

    const renderKeyObjectEditColumn = (column, placeholder) => {
      if (FIELDS_NOT_RELATED_TO_MASTER_SCHEMA.indexOf(element.type) !== -1) {
        // return (
        //   <div>
        //     <label htmlFor={`${index}-property-${column}`}>Property ddname</label>
        //     <Input
        //       id={`${index}-property-${column}`}
        //       value={""}
        //       type="text"
        //       // ref={this.refTitles}
        //       data-id={objKey}
        //       onChange={(event) => {}}
        //       className="form-control"
        //       placeholder={placeholder}
        //     />
        //   </div>
        // );

        return <div>{renderInputColumn(column, placeholder, "property name")}</div>;
      }

      //TODO refactor MasterSchemaProperty to handle only 1 organization
      return (
        <div>
          <FieldLabel label={"Input name (reference)"} required />
          <MasterSchemaProperty
            onChangeFieldId={(fieldId) => {
              onChangeMasterSchemaProperty(fieldId);
            }}
            fieldId={element.masterSchemaPropertyId}
            organizations={[organization]}
          />
        </div>
      );
    };

    const renderEditor = (column, placeholder, inputType = "text", defaultValue = "") => {
      return (
        <WysiwygEditor
          id={`${index}-${column}`}
          type={inputType}
          data={null}
          onChange={(event) => this.wysiwygChange(event, objKey, column)}
          className="form-control"
          placeholder={placeholder}
        />
      );
    };

    const renderOptionsEdit = () => {
      return (
        <Col>
          {["Test", "More test"].map((enumInput, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-md-10 form-group">
                  <input id={`${index}-`} value={enumInput} type="text" onChange={() => {}} className="form-control" />
                </div>

                <div className="col-md-2 form-group">
                  <button type="submit" onClick={() => {}} className="btn btn-danger">
                    X
                  </button>
                </div>
              </div>
            );
          })}
          <div className="text-center">
            <button type="submit" onClick={() => {}} className="btn btn-primary">
              Add
            </button>
          </div>
        </Col>
      );
    };

    const renderSelectColumn = (column, label, values) => {
      // return (
      //   <select id={`${index}-${column}`} className="form-control" value={null} onChange={() => {}}>
      //     {values.map((type, indexType) => (
      //       <option key={indexType}>{type}</option>
      //     ))}
      //   </select>
      // );
      return (
        <Col md={12} className={"custom-react-select mb-2 w-100"}>
          <FieldLabel label={label} />
          <Select
            maxMenuHeight={175}
            isDisabled={false}
            styles={colourStyles}
            isMulti={false}
            name="colors"
            value={{ value: element[column], label: element[column] }}
            onChange={(value) => handleChange(column, value.value)}
            options={values.map((value) => ({ value: value, label: value }))}
            className="React"
            classNamePrefix="select"
            placeholder={"Select an option"}
          />
        </Col>
      );
    };

    const renderRequiredColumn = (column) => {
      return (
        <div className="w-100">
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label="Is required"
            id={`${index}-${column}`}
            onChange={() => {
              handleChange("isRequired", !element.isRequired);
            }}
            checked={element.isRequired}
          />
        </div>
      );
    };

    const renderLabelShowing = (column) => {
      return (
        <div className="w-100">
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label="Label showing"
            id={`${index}-${column}`}
            onChange={() => {
              handleChange("isLabelShowing", !element.isLabelShowing);
            }}
            checked={element.isLabelShowing}
          />
        </div>
      );
    };

    const renderLabel = (column, text) => {
      return <label htmlFor={`${index}-${column}`}>{text}</label>;
    };

    const renderNumberColumn = (column, text) => (
      <Col md="6">
        <FormGroup>{renderInputNumberColumn(column, text, text)}</FormGroup>
      </Col>
    );

    const renderRequiredAndLabelShowCheckboxes = () => (
      <>
        <Col md="12">
          <FormGroup>{renderRequiredColumn(objKey)}</FormGroup>
        </Col>
        <Col md="12">
          <FormGroup>{renderLabelShowing(objKey)}</FormGroup>
        </Col>
      </>
    );

    const renderSpecificType = () => {
      let labelForControls = (
        <div>
          <div className="form-group">{renderInputColumn("title", "Title", "Title")}</div>
        </div>
      );

      switch (element.type) {
        // case Constants.FIELD_TYPE_REFERENCE: {
        //   // todo make constant fieldId
        //   return (
        //     <MasterSchemaField onChangeFieldId={onChangeFieldId} fieldId={schemaPropertyEdit.field_id}/>
        //   );
        // }
        case FIELD_TYPES.text: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>
                  {renderNumberColumn("minLength", "Min Length")}
                  {renderNumberColumn("maxLength", "Max Length")}

                  {renderRequiredAndLabelShowCheckboxes()}
                </Row>
              </Col>
            </Row>
          );
        }
        case FIELD_TYPES.number: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>
                  {renderNumberColumn("minimum", "Minimum")}
                  {renderNumberColumn("maximum", "Maximum")}

                  {renderRequiredAndLabelShowCheckboxes()}
                </Row>
              </Col>
            </Row>
          );
        }
        case FIELD_TYPES.file: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>{renderRequiredAndLabelShowCheckboxes()}</Row>
              </Col>
            </Row>
          );
        }
        case FIELD_TYPES.fileList: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>{renderRequiredAndLabelShowCheckboxes()}</Row>
              </Col>
            </Row>
          );
        }
        case FIELD_TYPES.boolean: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>
                  <Col md="12">
                    <FormGroup>{renderRequiredColumn(objKey)}</FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          );
        }
        case FIELD_TYPES.textArea: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>
                  {renderNumberColumn("minLength", "Min Length")}
                  {renderNumberColumn("maxLength", "Max Length")}

                  {renderRequiredAndLabelShowCheckboxes()}
                </Row>
              </Col>
            </Row>
          );
        }
        // TODO HANLDE TYPE LONG TEXT
        case Constants.FIELD_TYPE_LONG_TEXT_AREA: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>
                  {renderNumberColumn("minLength", "Min Length")}
                  {renderNumberColumn("maxLength", "Max Length")}

                  {renderRequiredAndLabelShowCheckboxes()}
                </Row>
              </Col>
            </Row>
          );
        }
        case FIELD_TYPES.date: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>
                  {/*{renderLabel("format", "Format")}*/}
                  {renderSelectColumn("format", "Format", DATE_WIDGET_FORMATS)}
                </Row>
              </Col>
            </Row>
          );
        }
        case FIELD_TYPES.select: {
          return (
            <Row>
              <Col md="12">
                {labelForControls}
                <Row>
                  {renderOptionsEdit()}
                  {renderRequiredAndLabelShowCheckboxes()}
                </Row>
              </Col>
            </Row>
          );
        }
        case Constants.FIELD_TYPE_MULTI_SELECT: {
          return (
            <div>
              <div className="row" key={index}>
                <Col md="12">{labelForControls}</Col>
                {renderOptionsEdit()}
                {renderRequiredAndLabelShowCheckboxes()}
              </div>
            </div>
          );
        }
        case FIELD_TYPES.helpText: {
          return (
            <div>
              <FormGroup>{renderEditor("description", "Description")}</FormGroup>
            </div>
          );
        }
        default:
          return <div />;
      }
    };

    // let dependencyFields = this.renderDependencyPart('fields', objKey);
    // let currentSpecificType = getSpecificType(this.state.schema.properties[objKey]);

    const renderPropertyKey = () => {
      return (
        <React.Fragment>
          {/*{renderLabel('property-' + objKey, 'Property')}*/}
          <div className="form-group">{renderKeyObjectEditColumn(objKey, "Property")}</div>
        </React.Fragment>
      );
    };

    return (
      <div className={"col-md-12 px-0"} key={"control-edit-" + objKey + "-" + index}>
        <div className="form-group position-relative">
          <div className=" dform-input-setting">
            <div className="vertical-center dform-input">
              <div className="form-group">
                {/*{renderLabel("type", "Type")}*/}
                {/*<select id={`${index}-type`} className="form-control" value={element.type} onChange={handleTypeChange}>*/}
                {/*  {Object.values(FIELD_TYPES).map((type, indexType) => (*/}
                {/*    <option key={indexType}>{type}</option>*/}
                {/*  ))}*/}
                {/*</select>*/}
                <div className={"custom-react-select mb-2"}>
                  <FieldLabel label={"Element type"} />
                  <Select
                    maxMenuHeight={175}
                    isDisabled={false}
                    styles={colourStyles}
                    isMulti={false}
                    name="colors"
                    value={{ value: element.type, label: element.type }}
                    onChange={handleTypeChange}
                    options={Object.values(FIELD_TYPES).map((type) => ({ value: type, label: type }))}
                    className="React"
                    classNamePrefix="select"
                    placeholder={"Select an option"}
                  />
                </div>
                <div className={"custom-react-select"}>
                  <FieldLabel label={"Element group"} />
                  <Select
                    maxMenuHeight={175}
                    isDisabled={false}
                    styles={colourStyles}
                    isMulti={false}
                    name="colors"
                    value={{ value: element.groupId, label: data.groups[element.groupId].name }}
                    onChange={handleFieldGroupChange}
                    options={Object.values(data.groups).map((group) => ({
                      value: group.id,
                      label: group.name,
                    }))}
                    className="React"
                    classNamePrefix="select"
                    placeholder={"Select an option"}
                  />
                </div>
              </div>
              {renderPropertyKey()}
              {renderSpecificType()}
            </div>
            {/*<div className="vertical-center dform-input mr-0">*/}
            {/*    <div className="">*/}
            {/*      <div className="col-md-12 form-group">*/}
            {/*        <label>Section</label>*/}
            {/*        <select*/}
            {/*          className="form-control"*/}
            {/*          value={""}*/}
            {/*          onChange={event => this.changeSection(event, objKey)}>*/}
            {/*          {[].map((menuName, index) => <option*/}
            {/*            key={index}>{menuName}</option>)}*/}
            {/*        </select>*/}
            {/*      </div>*/}
            {/*      <div className="col-md-12 form-group">*/}
            {/*        <label>Group</label>*/}
            {/*        <select*/}
            {/*          className="form-control"*/}
            {/*          value={""}*/}
            {/*          onChange={event => this.changeGroup(event, objKey)}>*/}
            {/*          {[]*/}
            {/*            .filter(group => this.state.uiSchema.sectionGroups[group] === this.state.uiSettings.section)*/}
            {/*            .map((group, index) => <option*/}
            {/*              key={index}>{group}</option>)}*/}
            {/*        </select>*/}
            {/*      </div>*/}
            {/*      <div className="col-md-12 form-group">*/}
            {/*        <label>Classes</label>*/}
            {/*        <select*/}
            {/*          className="form-control"*/}
            {/*          value={""}*/}
            {/*          onChange={event => this.changeClasses(event, objKey)}>*/}
            {/*          {['', 'col-md-6', 'col-md-12'].map((col, index) => <option*/}
            {/*            key={index}>{col}</option>)}*/}
            {/*        </select>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="col-md-12 form-group">*/}
            {/*      <Checkbox*/}
            {/*        color="primary"*/}
            {/*        icon={<Check className="vx-icon" size={16}/>}*/}
            {/*        label="is protected"*/}
            {/*        onChange={event => {*/}
            {/*          this.setState({*/}
            {/*            uiSettings: {...this.state.uiSettings, protectedProperty: event.target.checked}*/}
            {/*          })*/}
            {/*        }}*/}
            {/*        checked={false}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    );
  };

  return renderConfigFields("test", 1);
};

export default FieldProperties;
