import React from "react";
import Constants from "./utils/constants";
import { Col, FormGroup, Row } from "reactstrap";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";

const ControlTypeFactory = ({ specificType, index, schemaPropertyEdit, objKey }) => {
  const renderLabel = (column, text) => {
    return <label htmlFor={`${index}-${column}`}>{text}</label>;
  };

  const renderInputNumberColumn = (column, placeholder, defaultValue = 0) => {
    return (
      <input
        id={`${index}-${column}`}
        value={column in schemaPropertyEdit ? schemaPropertyEdit[column] : defaultValue}
        type="number"
        onChange={(event) => this.inputNumberChangeHandler(event, objKey, column)}
        className="form-control"
        placeholder={placeholder}
      />
    );
  };

  const renderSelectColumn = (column, values) => {
    return (
      <select
        id={`${index}-${column}`}
        className="form-control"
        value={schemaPropertyEdit[column]}
        onChange={(event) => this.inputChangeHandler(event, objKey, column)}
      >
        {values.map((type, indexType) => (
          <option key={indexType}>{type}</option>
        ))}
      </select>
    );
  };

  const renderRequiredColumn = (column, text) => {
    return (
      <div className="w-100">
        <Checkbox
          color="primary"
          icon={<Check className="vx-icon" size={16} />}
          label="Is required"
          id={`${index}-${column}`}
          onChange={(event) => this.inputHandlerRequired(event, objKey)}
          checked={this.state.schemaRequiredFields.indexOf(objKey) !== -1}
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
          onChange={(event) => this.setLabelShowingCheckbox()}
          checked={this.getLabelShowingCheckbox()}
        />
      </div>
    );
  };

  switch (specificType) {
    case Constants.FIELD_TYPE_TEXT: {
      return (
        <Row>
          <Col md="6">
            <FormGroup>
              {renderLabel("minLength", "Min length")}
              {renderInputNumberColumn("minLength", "Min length")}
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              {renderLabel("maxLength", "Max length")}
              {renderInputNumberColumn("maxLength", "Max length")}
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderRequiredColumn(objKey, "Required?")}</FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </Row>
      );
    }
    case Constants.FIELD_TYPE_NUMBER: {
      return (
        <Row>
          <Col md="6">
            <FormGroup>
              {renderLabel("minimum", "Min length")}
              {renderInputNumberColumn("minimum", "Min length")}
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              {renderLabel("maximum", "Max length")}
              {renderInputNumberColumn("maximum", "Max length")}
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderRequiredColumn(objKey, "Required?")}</FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </Row>
      );
    }
    case Constants.FIELD_TYPE_FILE: {
      return (
        <Row>
          <Col md="12">
            <FormGroup>{renderRequiredColumn(objKey, "Required?")}</FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </Row>
      );
    }
    case Constants.FIELD_TYPE_FILE_LIST: {
      return (
        <Row>
          <Col md="12">
            <FormGroup>{renderRequiredColumn(objKey, "Required?")}</FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </Row>
      );
    }
    case Constants.FIELD_TYPE_BOOLEAN: {
      return (
        <Row>
          <Col md="12">
            <FormGroup>{renderRequiredColumn(objKey, "Required?")}</FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </Row>
      );
    }
    case Constants.FIELD_TYPE_TEXT_AREA: {
      return (
        <Row>
          <Col md="6">
            <FormGroup>
              {renderLabel("minLength", "Min length")}
              {renderInputNumberColumn("minLength", "Min length")}
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              {renderLabel("maxLength", "Max length")}
              {renderInputNumberColumn("maxLength", "Max length")}
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderRequiredColumn(objKey, "Required?")}</FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </Row>
      );
    }
    case Constants.FIELD_TYPE_DATE: {
      return (
        <div>
          {renderLabel("format", "Format")}
          {renderSelectColumn("format", ["date", "date-time"])}
          <div>{renderRequiredColumn(objKey, "Required?")}</div>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </div>
      );
    }
    case Constants.FIELD_TYPE_SELECT: {
      return (
        <div>
          {schemaPropertyEdit.enum.map((enumInput, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-md-10 form-group">
                  <input
                    id={`${index}-`}
                    value={enumInput}
                    type="text"
                    onChange={(event) => this.setSelectValues(event, objKey, index)}
                    className="form-control"
                  />
                </div>

                <div className="col-md-2 form-group">
                  <button
                    type="submit"
                    onClick={(event) => this.removeSelectValues(event, objKey, index)}
                    className="btn btn-danger"
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
          <div className="text-center">
            <button
              type="submit"
              onClick={(event) => this.addSelectValues(event, objKey, index)}
              className="btn btn-primary"
            >
              Add
            </button>
          </div>
          <div>{renderRequiredColumn(objKey, "Required?")}</div>
          <Col md="12">
            <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
          </Col>
        </div>
      );
    }
    case Constants.FIELD_TYPE_MULTI_SELECT: {
      return (
        <div>
          <div className="row" key={index}>
            <div className="col-md-12 form-group">
              {renderLabel("uischema-multiselect-checkboxes", "UI style")}
              <select
                id="uischema-multiselect-checkboxes"
                className="form-control"
                value={this.getUiSchemaTemplateMultiselect(objKey)}
                onChange={(event) => this.changeUiSchemaTemplateMultiselect(event)}
              >
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
                        onChange={(event) => this.setMultiSelectTitle(event, objKey, index)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-5 form-group">
                      <input
                        key={index}
                        id={`${index}-`}
                        value={multiSelectObj.enum[0]}
                        type="text"
                        onChange={(event) => this.setMultiSelectValues(event, objKey, index)}
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-2 form-group">
                      <button
                        type="submit"
                        onClick={(event) => this.removeMultiSelectValues(event, objKey, index)}
                        className="btn btn-danger"
                      >
                        X
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="text-center">
                <button
                  type="submit"
                  onClick={(event) => this.addMultiSelectValues(event, objKey, index)}
                  className="btn btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="col-md-12">{renderRequiredColumn(objKey, "Required?")}</div>
            <div className="col-md-12">
              <FormGroup>{renderLabelShowing(objKey, "Required?")}</FormGroup>
            </div>
          </div>
        </div>
      );
    }
    default:
      return <div></div>;
  }
};

export default ControlTypeFactory;
