import React from "react";

import Constants from "../../../../../../../../components/FormCreate/Parts/Constants";
import { Col, FormGroup, Input, Row } from "reactstrap";
import MasterSchemaProperty from "../../../../../../../../components/FormCreate/Fields/MasterSchemaProperty";
import WysiwygEditor from "../../../../../../../../components/FormCreate/Custom/WysiwygEditor";
import Checkbox from "../../../../../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import { FIELD_TYPES } from "../../../../../../constants";

const FieldProperties = ({ element, onElementChange }) => {
  const handleTypeChange = (e) => {
    onElementChange({ ...element, type: e.target.value });
  };

  const handleChange = (property, value) => {
    onElementChange({ ...element, [property]: value });
  };

  const renderConfigFields = (objKey, index) => {
    // add collback for inputHandlerRequired and custom changes
    const renderInputNumberColumn = (column, placeholder, defaultValue = 0) => {
      return (
        <input
          id={`${index}-${column}`}
          // value={""}
          type="number"
          onChange={() => {}}
          className="form-control"
          placeholder={placeholder}
        />
      );
    };

    const renderKeyObjectEditColumn = (column, placeholder) => {
      if (Constants.NOT_MASTER_SCHEMA_FIELDS.indexOf("test") !== -1) {
        return (
          <div>
            <label htmlFor={`${index}-property-${column}`}>Property name</label>
            <Input
              id={`${index}-property-${column}`}
              value={this.state.fieldEdit.propertyKey}
              type="text"
              // ref={this.refTitles}
              data-id={objKey}
              onChange={(event) =>
                this.setState({
                  fieldEdit: {
                    ...this.state.fieldEdit,
                    propertyKey: event.target.value,
                  },
                })
              }
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
              onChangeMasterSchemaProperty(fieldId);
            }}
            fieldId={1}
            organizations={[]}
          />
        </div>
      );
    };

    const renderInputColumn = (column, placeholder, inputType = "text", defaultValue = "") => {
      return (
        <input
          id={`${index}-${column}`}
          value={element[column]}
          type={inputType}
          onChange={(e) => handleChange(column, e.target.value)}
          className="form-control"
          placeholder={placeholder}
        />
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

    const renderSelectColumn = (column, values) => {
      return (
        <select id={`${index}-${column}`} className="form-control" value={null} onChange={() => {}}>
          {values.map((type, indexType) => (
            <option key={indexType}>{type}</option>
          ))}
        </select>
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

    const onChangeMasterSchemaProperty = (fieldId) => {
      this.changeMasterSchemaFieldId(fieldId);
      this.setState({ fieldEdit: { ...this.state.fieldEdit, propertyKey: fieldId } });
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
          <FormGroup>{renderRequiredColumn(objKey)}</FormGroup>
        </Col>
        <Col md="12">
          <FormGroup>{renderLabelShowing(objKey)}</FormGroup>
        </Col>
      </>
    );

    const renderSpecificType = () => {
      // TODO labelForControls is outdated this, remove after full refactor. Replace it with LabeledField
      let labelForControls = (
        <div>
          {renderLabel("title", "Title")}
          <div className="form-group">{renderInputColumn("title", "Title")}</div>
        </div>
      );

      const LabeledField = (props) => (
        <Row>
          <Col md="12">
            <div>
              {renderLabel("title", "Title")}
              <div className="form-group">{renderInputColumn("title", "Title")}</div>
            </div>
            <Row>{props.children}</Row>
          </Col>
        </Row>
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
            <LabeledField>
              {renderNumberColumn("minLength", "Min Length")}
              {renderNumberColumn("maxLength", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </LabeledField>
          );
        }
        case FIELD_TYPES.number: {
          return (
            <LabeledField>
              {renderNumberColumn("minimum", "Min Length")}
              {renderNumberColumn("maximum", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </LabeledField>
          );
        }
        case FIELD_TYPES.file: {
          return <LabeledField>{renderRequiredAndLabelShowCheckboxes()}</LabeledField>;
        }
        case FIELD_TYPES.fileList: {
          return <LabeledField>{renderRequiredAndLabelShowCheckboxes()}</LabeledField>;
        }
        case FIELD_TYPES.boolean: {
          return <LabeledField>{renderRequiredAndLabelShowCheckboxes()}</LabeledField>;
        }
        case FIELD_TYPES.textArea: {
          return (
            <LabeledField>
              {renderNumberColumn("minLength", "Min Length")}
              {renderNumberColumn("maxLength", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </LabeledField>
          );
        }
        // TODO HANLDE TYPE LONG TEXT
        case Constants.FIELD_TYPE_LONG_TEXT_AREA: {
          return (
            <LabeledField>
              {renderNumberColumn("minLength", "Min Length")}
              {renderNumberColumn("maxLength", "Max Length")}

              {renderRequiredAndLabelShowCheckboxes()}
            </LabeledField>
          );
        }
        case FIELD_TYPES.date: {
          return (
            <LabeledField>
              {renderLabel("format", "Format")}
              {renderSelectColumn("format", ["date", "date-time"])}
            </LabeledField>
          );
        }
        case FIELD_TYPES.select: {
          return (
            <LabeledField>
              <Col>
                {["Test", "More test"].map((enumInput, index) => {
                  return (
                    <div className="row" key={index}>
                      <div className="col-md-10 form-group">
                        <input
                          id={`${index}-`}
                          value={enumInput}
                          type="text"
                          onChange={() => {}}
                          className="form-control"
                        />
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
              {renderRequiredAndLabelShowCheckboxes()}
            </LabeledField>
          );
        }
        // case Constants.FIELD_TYPE_MULTI_SELECT: {
        //   return (<div>
        //     <div className="row" key={index}>
        //       <Col md="12">
        //         {labelForControls}
        //       </Col>
        //
        //       <div className="col-md-12 form-group">
        //         {renderLabel('uischema-multiselect-checkboxes', 'UI style')}
        //         <select id="uischema-multiselect-checkboxes" className="form-control"
        //                 value={this.getUiSchemaTemplateMultiselect(objKey)}
        //                 onChange={(event) => this.changeUiSchemaTemplateMultiselect(event)}>
        //           <option>default</option>
        //           <option>checkboxes</option>
        //         </select>
        //       </div>
        //       <div className="col-md-12">
        //         {schemaPropertyEdit.items.anyOf.map((multiSelectObj, index) => {
        //           return (
        //             <div className="row" key={index}>
        //               <div className="col-md-10 form-group">
        //                 <input
        //                   id={`${index}-`}
        //                   value={multiSelectObj.title}
        //                   type="text"
        //                   onChange={event => this.setMultiSelectTitleAndValue(event, objKey, index)}
        //                   className="form-control"/>
        //               </div>
        //               <div className="col-md-2 form-group">
        //                 <button type="submit"
        //                         onClick={event => this.removeMultiSelectValues(event, objKey, index)}
        //                         className="btn btn-danger">X
        //                 </button>
        //               </div>
        //
        //             </div>
        //           );
        //         })}
        //         <div className="text-center">
        //           <button type="submit"
        //                   onClick={event => this.addMultiSelectValues(event, objKey, index)}
        //                   className="btn btn-primary">Add
        //           </button>
        //         </div>
        //       </div>
        //
        //       {renderRequiredAndLabelShowCheckboxes()}
        //     </div>
        //   </div>)
        // }
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
                {renderLabel("type", "Type")}
                <select id={`${index}-type`} className="form-control" value={element.type} onChange={handleTypeChange}>
                  {Object.values(FIELD_TYPES).map((type, indexType) => (
                    <option key={indexType}>{type}</option>
                  ))}
                </select>
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
