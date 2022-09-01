import "./styles.scss";

import React from "react";
import { toast } from "react-toastify";
import { Button, Col, FormGroup, Row } from "reactstrap";

import { DATE_WIDGET_FORMATS, FIELDS_NOT_RELATED_TO_MASTER_SCHEMA } from "features/Applications/constants";

import WysiwygEditor from "components/FormCreate/Custom/WysiwygEditor";
import MasterSchemaProperty from "components/FormCreate/Fields/MasterSchemaProperty";

import { FIELD_TYPES } from "components/DForm/constants";
import { DFormFieldLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormFieldLabel";
import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";
import { DFormNumberWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormNumberWidget";
import { DFormBooleanWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormBooleanWidget";

export const FieldDefaultEditProperties = ({ element, onFieldChange }) => {
  const onRequiredChange = () => onFieldChange("isRequired", !element.isRequired);

  const onLabelShowingChange = () => onFieldChange("isLabelShowing", !element.isLabelShowing);

  return (
    <Row className="mb-2">
      <Col md="6">
        <DFormBooleanWidget
          id="field-required"
          label="Is required"
          value={element.isRequired}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onRequiredChange}
        />
      </Col>
      <Col md="6">
        <DFormBooleanWidget
          id="field-label-showing"
          label="Label showing"
          value={element.isLabelShowing}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onLabelShowingChange}
        />
      </Col>
    </Row>
  );
};

export const FieldMinMaxEditProperty = ({ element, onFieldChange }) => {
  const onMinimumChange = (value) => onFieldChange("minimum", value === "" ? null : Number(value));

  const onMaximumChange = (value) => onFieldChange("maximum", value === "" ? null : Number(value));

  return (
    <Row className="mb-2">
      <Col md="6">
        <DFormNumberWidget
          label="Minimum"
          id="field-minimum"
          value={element["minimum"] ?? ""}
          onChange={onMinimumChange}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
        />
      </Col>
      <Col md="6">
        <DFormNumberWidget
          label="Maximum"
          id="field-maximum"
          value={element["maximum"] ?? ""}
          onChange={onMaximumChange}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
        />
      </Col>
    </Row>
  );
};

export const FieldMinMaxLengthEditProperty = ({ element, onFieldChange }) => {
  const onMinLengthChange = (value) => onFieldChange("minLength", value === "" ? null : Number(value));

  const onMaxLengthChange = (value) => onFieldChange("maxLength", value === "" ? null : Number(value));

  return (
    <Row className="mb-2">
      <Col md="6">
        <DFormNumberWidget
          label="Min length"
          id="field-min-length"
          value={element["minLength"] ?? ""}
          onChange={onMinLengthChange}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
        />
      </Col>
      <Col md="6">
        <DFormNumberWidget
          label="Max length"
          id="field-max-length"
          value={element["maxLength"] ?? ""}
          onChange={onMaxLengthChange}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
        />
      </Col>
    </Row>
  );
};

export const FieldStringLikeTextEditProperties = ({ element, onFieldChange }) => {
  return (
    <>
      <FieldMinMaxLengthEditProperty element={element} onFieldChange={onFieldChange} />
      <FieldDefaultEditProperties element={element} onFieldChange={onFieldChange} />
    </>
  );
};

export const FieldDateEditProperties = ({ element, onFieldChange }) => {
  const onChange = ({ value }) => onFieldChange("format", value);

  return (
    <>
      <Row className="mb-2">
        <Col md="12">
          <DFormSelectWidget
            id="field-date-format"
            label="Date format"
            value={element.format ? { value: element.format, label: element.format } : null}
            options={DATE_WIDGET_FORMATS.map((format) => ({ value: format, label: format }))}
            isError={false}
            isRequired={false}
            isDisabled={false}
            isLabelShowing={true}
            onChange={onChange}
            placeholder="Select an date Format"
          />
        </Col>
      </Row>

      <FieldDefaultEditProperties element={element} onFieldChange={onFieldChange} />
    </>
  );
};

export const FieldSelectOptionItem = ({ index, value, onOptionRemove, onOptionChange }) => {
  const onClick = () => onOptionRemove(value);

  const onChange = (value) => onOptionChange({ value, index });

  return (
    <div className="d-flex py-1">
      <div className="width-80-per">
        <DFormTextWidget
          id={value}
          value={value}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={false}
          placeholder="Enter your option here"
          onChange={onChange}
        />
      </div>

      <div className="d-flex justify-content-end width-20-per">
        <Button size="sm" color="danger" onClick={onClick}>
          X
        </Button>
      </div>
    </div>
  );
};

export const FieldSelectOptionsEditProperty = ({ element, onFieldChange }) => {
  const onOptionAdd = () => {
    const newOption = `New Option ${element.options.length + 1}`;
    const newOptions = [...(element.options ?? []), newOption];
    onFieldChange("options", newOptions);
  };

  const onOptionRemove = (value) => {
    const newOptions = element.options;
    newOptions.splice(newOptions.indexOf(value), 1);
    onFieldChange("options", newOptions);
  };

  const onOptionChange = (newOption) => {
    if (element.options.filter((option) => option === newOption.value).length > 0) {
      toast.warn(`The option should be unique. There is a duplicated option: "${newOption.value}"`);
    }

    const newOptions = element.options.map((option, index) => (index === newOption.index ? newOption.value : option));

    onFieldChange("options", newOptions);
  };

  if (element.options.length === 0) {
    return (
      <Row className="mb-2">
        <Col md="12">
          <div className="py-1 text-center">There are no options.</div>
        </Col>

        <Col md="12">
          <div className="d-flex justify-content-center">
            <Button color="primary" onClick={onOptionAdd}>
              Add
            </Button>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="mb-2">
      <Col md="12">
        {element.options.map((option, index) => (
          <FieldSelectOptionItem
            index={index}
            value={option}
            onOptionChange={onOptionChange}
            onOptionRemove={onOptionRemove}
            key={`option-${index}`}
          />
        ))}
      </Col>

      <Col md="12">
        <div className="d-flex justify-content-center">
          <Button color="primary" onClick={onOptionAdd}>
            Add
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export const FieldSelectEditProperties = ({ element, onFieldChange }) => {
  return (
    <>
      <FieldSelectOptionsEditProperty element={element} onFieldChange={onFieldChange} />
      <FieldDefaultEditProperties element={element} onFieldChange={onFieldChange} />
    </>
  );
};

export const FieldNumberEditProperties = ({ element, onFieldChange }) => {
  return (
    <>
      <FieldMinMaxEditProperty element={element} onFieldChange={onFieldChange} />
      <FieldDefaultEditProperties element={element} onFieldChange={onFieldChange} />
    </>
  );
};

export const SpecificFieldProperties = ({ element, onFieldChange }) => {
  // ToDo remove it
  ////////////////////////////////////
  const index = 0;
  const objKey = "";
  const handleChange = () => {};
  ////////////////////////////////////

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
        <DFormFieldLabel label={label} id={`${index}-${column}`} />
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

  const renderSpecificType = () => {
    let labelForControls = (
      <div>
        <div className="form-group">{renderInputColumn("title", "Title", "Title")}</div>
      </div>
    );

    switch (element.type) {
      /*case FIELD_TYPES.text: {
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
                {renderSelectColumn("format", "Format", DATE_WIDGET_FORMATS)}
                {renderRequiredAndLabelShowCheckboxes()}
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
      }*/
      case FIELD_TYPES.helpText: {
        return (
          <div>
            <FormGroup>{renderEditor("description", "Description")}</FormGroup>
          </div>
        );
      }
    }
  };

  switch (element.type) {
    case FIELD_TYPES.text:
    case FIELD_TYPES.longText:
    case FIELD_TYPES.textArea:
      return <FieldStringLikeTextEditProperties element={element} onFieldChange={onFieldChange} />;
    case FIELD_TYPES.date:
      return <FieldDateEditProperties element={element} onFieldChange={onFieldChange} />;
    case FIELD_TYPES.select:
    case FIELD_TYPES.multiSelect:
      return <FieldSelectEditProperties element={element} onFieldChange={onFieldChange} />;
    case FIELD_TYPES.number:
      return <FieldNumberEditProperties element={element} onFieldChange={onFieldChange} />;
    case FIELD_TYPES.file:
    case FIELD_TYPES.fileList:
    case FIELD_TYPES.boolean:
    default:
      return <FieldDefaultEditProperties element={element} onFieldChange={onFieldChange} />;
  }
};

const FieldProperties = (props) => {
  const { element, organization, data, onFieldGroupChange: propOnFieldGroupChange, onElementChange } = props;

  const onFieldChange = (property, value) => onElementChange({ ...element, [property]: value });

  const onFieldTypeChange = ({ value }) => onFieldChange("type", value);

  const onFieldGroupChange = ({ value }) => propOnFieldGroupChange(element.id, element.groupId, value);

  const onFieldTitleChange = (value) => onFieldChange("title", value);

  const onChangeMasterSchemaProperty = (fieldId) => onFieldChange("masterSchemaFieldId", fieldId);

  return (
    <>
      <div className="mb-2">
        <DFormSelectWidget
          id="field-type"
          label="Element type"
          value={{ value: element.type, label: element.type }}
          options={Object.values(FIELD_TYPES).map((type) => ({ value: type, label: type }))}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onFieldTypeChange}
          placeholder="Select an Element type"
        />
      </div>

      <div className="mb-2">
        <DFormSelectWidget
          id="field-group"
          label="Element group"
          value={{ value: element.groupId, label: data.groups[element.groupId].name }}
          options={Object.values(data.groups).map((group) => ({ value: group.id, label: group.name }))}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onFieldGroupChange}
          placeholder="Select an Element group"
        />
      </div>

      <div className="mb-2">
        {FIELDS_NOT_RELATED_TO_MASTER_SCHEMA.includes(element.type) ? null : (
          <>
            <DFormFieldLabel label="Input name (reference)" id="field-reference" isRequired />
            {/* //TODO refactor MasterSchemaProperty to handle only 1 organization */}
            <MasterSchemaProperty
              id="field-reference"
              organizations={[organization]}
              fieldId={element.masterSchemaFieldId}
              onChangeFieldId={onChangeMasterSchemaProperty}
            />
            {/*<DFormSelectWidget
                id="field-reference"
                label="Input name (reference)"
                value={{ value: element.groupId, label: data.groups[element.groupId].name }}
                options={Object.values(data.groups).map((group) => ({ value: group.id, label: group.name }))}
                isError={false}
                isRequired={true}
                isDisabled={false}
                isLabelShowing={true}
                onChange={onFieldGroupChange}
                placeholder="Select an Element group"
              />*/}
          </>
        )}
      </div>

      <div className="mb-2">
        <DFormTextWidget
          id="field-title"
          label="Title"
          value={element.title}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onFieldTitleChange}
        />
      </div>

      <SpecificFieldProperties element={element} onFieldChange={onFieldChange} />
    </>
  );
};

export default FieldProperties;
