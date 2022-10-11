import React from "react";
import { Form } from "antd";
import { toast } from "react-toastify";
import { Button, Col, Row } from "reactstrap";

import { useApplicationResourceManagerFields } from "../../../../../../../data/applicationQueries";
import { NmpButton, NmpInput, NmpSelect, NpmCheckbox } from "features/nmp-ui";
import {
  DATE_WIDGET_FORMATS,
  ResourceCompileOptionLabel,
  FIELDS_NOT_RELATED_TO_MASTER_SCHEMA,
} from "features/Applications/constants";

import WysiwygEditor from "components/FormCreate/Custom/WysiwygEditor";
import MasterSchemaProperty from "components/FormCreate/Fields/MasterSchemaProperty";

import { FieldTypes } from "components/DForm";
import { DFormFieldLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormFieldLabel";

export const FieldRequiredEditProperty = ({ element, onFieldChange }) => {
  const onRequiredChange = () => onFieldChange("isRequired", !element.isRequired);

  return (
    <Form.Item name={"field-required"} className="dform-field mb-2">
      <NpmCheckbox
        id={"field-required"}
        checked={element.isRequired}
        onChange={(event) => onRequiredChange(event.target.value)}
        label={<DFormFieldLabel label={"Is required"} small />}
      />
    </Form.Item>
  );
};

export const FieldProtectedEditProperty = ({ element, onFieldChange }) => {
  const onProtectedChange = () => onFieldChange("isProtected", !element.isProtected);

  return (
    <Form.Item name={"field-protected"} className="dform-field mb-2">
      <NpmCheckbox
        id={"field-protected"}
        checked={element.isProtected}
        onChange={(event) => onProtectedChange(event.target.value)}
        label={<DFormFieldLabel label={"Is protected"} small />}
      />
    </Form.Item>
  );
};

export const FieldLabelShowingEditProperty = ({ element, onFieldChange }) => {
  const onLabelShowingChange = () => onFieldChange("isLabelShowing", !element.isLabelShowing);

  return (
    <Form.Item name={"field-label-showing"} className="dform-field mb-2">
      <NpmCheckbox
        id={"field-label-showing"}
        checked={element.isLabelShowing}
        onChange={(event) => onLabelShowingChange(event.target.value)}
        label={<DFormFieldLabel label={"Label showing"} small />}
      />
    </Form.Item>
  );
};

export const FieldDefaultEditProperties = ({ element, onFieldChange }) => {
  return (
    <Row>
      <Col md="12" className="mb-2">
        <FieldRequiredEditProperty element={element} onFieldChange={onFieldChange} />
      </Col>
      <Col md="12" className="mb-2">
        <FieldLabelShowingEditProperty element={element} onFieldChange={onFieldChange} />
      </Col>
      <Col md="12">
        <FieldProtectedEditProperty element={element} onFieldChange={onFieldChange} />
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
        <Form.Item label={"Minimum"} name={"field-minimum"} className="dform-field mb-2">
          <NmpInput
            id={"field-minimum"}
            type="number"
            value={element["minimum"] ?? ""}
            placeholder="Enter your answer here"
            onChange={(event) => onMinimumChange(event.target.value)}
            className="dform-number-field"
          />
        </Form.Item>
      </Col>
      <Col md="6">
        <Form.Item label={"Maximum"} name={"field-maximum"} className="dform-field mb-2">
          <NmpInput
            id={"field-maximum"}
            type="number"
            value={element["maximum"] ?? ""}
            placeholder="Enter your answer here"
            onChange={(event) => onMaximumChange(event.target.value)}
            className="dform-number-field"
          />
        </Form.Item>
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
        <Form.Item label={"Min length"} name={"field-min-length"} className="dform-field mb-2">
          <NmpInput
            id={"field-min-length"}
            type="number"
            value={element["minLength"] ?? ""}
            placeholder="Enter your answer here"
            onChange={(event) => onMinLengthChange(event.target.value)}
            className="dform-number-field"
          />
        </Form.Item>
      </Col>

      <Col md="6">
        <Form.Item label={"Max length"} name={"field-max-length"} className="dform-field mb-2">
          <NmpInput
            id={"field-max-length"}
            type="number"
            value={element["maxLength"] ?? ""}
            placeholder="Enter your answer here"
            onChange={(event) => onMaxLengthChange(event.target.value)}
            className="dform-number-field"
          />
        </Form.Item>
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
          <Form.Item label="Date format" name="field-date-format" className="dform-field mb-2">
            <NmpSelect
              id={"field-date-format"}
              value={element.format ? { value: element.format, label: element.format } : null}
              options={DATE_WIDGET_FORMATS.map((format) => ({ value: format, label: format }))}
              placeholder="Select an date Format"
              onChange={onChange}
            />
          </Form.Item>
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
        <Form.Item name={value} className="dform-field mb-2">
          <NmpInput
            id={value}
            type="text"
            value={value}
            placeholder="Enter your option here"
            onChange={(event) => onChange(event.target.value)}
          />
        </Form.Item>
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

export const FieldHelpTextEditProperties = ({ element, onFieldChange }) => {
  const onChange = (value) => onFieldChange("helpTextValue", value ?? "");

  return (
    <Row>
      <Col md="12" className="mb-2">
        <WysiwygEditor
          id="field-help-text"
          type="text"
          data={element.helpTextValue}
          placeholder="Description"
          onChange={onChange}
        />
      </Col>

      <Col md="12">
        <FieldProtectedEditProperty element={element} onFieldChange={onFieldChange} />
      </Col>
    </Row>
  );
};

const queryConfig = {
  select: (fields) =>
    Array.isArray(fields)
      ? fields.map((field) => ({
          label: `${field.breadcrumbs}.${field.name}`,
          value: field.id,
        }))
      : [],
};

export const FieldResourceEditProperties = ({ element, organization, onFieldChange }) => {
  const queryParams = { organizationId: organization.id, organizationType: organization.type };
  const { isLoading, data: options = [] } = useApplicationResourceManagerFields(queryParams, queryConfig);

  const onResourceFieldIdChange = ({ value }) => onFieldChange("resourceManagerFieldId", value);

  const onResourceCompileOptionChange = ({ value }) => onFieldChange("resourceCompileOption", value);

  return (
    <>
      <Row className="mb-2">
        <Col md="12">
          <Form.Item
            label="Resource link"
            name="field-resource-manager-field-id"
            className="dform-field mb-2"
            rules={[{ required: true }]}
          >
            <NmpSelect
              id={"field-resource-manager-field-id"}
              value={
                element.resourceManagerFieldId
                  ? options.find(({ value }) => Number(value) === Number(element.resourceManagerFieldId))
                  : null
              }
              loading={isLoading}
              options={options}
              placeholder="Select a resource field"
              onChange={onResourceFieldIdChange}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md="12">
          <Form.Item
            label="Resource compile option"
            name="field-resource-compile-option"
            className="dform-field mb-2"
            rules={[{ required: true }]}
          >
            <NmpSelect
              id={"field-resource-compile-option"}
              value={
                element.resourceCompileOption
                  ? {
                      value: element.resourceCompileOption,
                      label: ResourceCompileOptionLabel[element.resourceCompileOption],
                    }
                  : null
              }
              options={[
                {
                  value: element.resourceCompileOption,
                  label: ResourceCompileOptionLabel[element.resourceCompileOption],
                },
              ]}
              loading={isLoading}
              placeholder="Select a resource compile option"
              onChange={onResourceCompileOptionChange}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md="12" className="mb-2">
          <FieldLabelShowingEditProperty element={element} onFieldChange={onFieldChange} />
        </Col>
        <Col md="12">
          <FieldProtectedEditProperty element={element} onFieldChange={onFieldChange} />
        </Col>
      </Row>
    </>
  );
};

export const SpecificFieldProperties = ({ element, organization, onFieldChange }) => {
  switch (element.type) {
    case FieldTypes.Text:
    case FieldTypes.LongText:
    case FieldTypes.TextArea:
      return <FieldStringLikeTextEditProperties element={element} onFieldChange={onFieldChange} />;
    case FieldTypes.Date:
      return <FieldDateEditProperties element={element} onFieldChange={onFieldChange} />;
    case FieldTypes.Select:
    case FieldTypes.MultiSelect:
      return <FieldSelectEditProperties element={element} onFieldChange={onFieldChange} />;
    case FieldTypes.Number:
      return <FieldNumberEditProperties element={element} onFieldChange={onFieldChange} />;
    case FieldTypes.HelpText:
      return <FieldHelpTextEditProperties element={element} onFieldChange={onFieldChange} />;
    case FieldTypes.Resource:
      return (
        <FieldResourceEditProperties element={element} organization={organization} onFieldChange={onFieldChange} />
      );
    case FieldTypes.File:
    case FieldTypes.FileList:
    case FieldTypes.Boolean:
    default:
      return <FieldDefaultEditProperties element={element} onFieldChange={onFieldChange} />;
  }
};

const FieldProperties = (props) => {
  const {
    element,
    organization,
    data,
    onFieldGroupChange: propOnFieldGroupChange,
    onElementChange,
    onDeleteButtonClick,
    onElementChangesSave,
    onElementChangesCancel,
  } = props;

  const onFieldChange = (property, value) => onElementChange({ ...element, [property]: value });

  const onFieldTypeChange = ({ value }) => onFieldChange("type", value);

  const onFieldGroupChange = ({ value }) => propOnFieldGroupChange(element.id, element.groupId, value);

  const onFieldTitleChange = (value) => onFieldChange("title", value);

  const onChangeMasterSchemaProperty = (fieldId) => onFieldChange("masterSchemaFieldId", fieldId);

  return (
    <Form layout={"vertical"}>
      <Form.Item label="Element type" name="field-type" className="dform-field mb-2">
        <NmpSelect
          id={"field-type"}
          value={{ value: element.type, label: element.type }}
          options={Object.values(FieldTypes).map((type) => ({ value: type, label: type }))}
          disabled={false}
          placeholder={"Select an Element type"}
          onChange={(_, option) => onFieldTypeChange(option)}
        />
      </Form.Item>

      <Form.Item label="Element group" name="field-group" className="dform-field mb-2">
        <NmpSelect
          id={"field-group"}
          value={{ value: element.groupId, label: data.groups[element.groupId].name }}
          disabled={false}
          placeholder={"Select an Element group"}
          options={Object.values(data.groups).map((group) => ({ value: group.id, label: group.name }))}
          onChange={(_, option) => onFieldGroupChange(option)}
        />
      </Form.Item>

      {FIELDS_NOT_RELATED_TO_MASTER_SCHEMA.includes(element.type) ? null : (
        <>
          <div className="mb-2">
            <Form.Item
              label="Input name (reference)"
              name="field-reference"
              rules={[{ required: true }]}
              className="dform-field mb-2"
            >
              <MasterSchemaProperty
                id="field-reference"
                organizations={[organization]}
                fieldId={element.masterSchemaFieldId}
                onChangeFieldId={onChangeMasterSchemaProperty}
              />
            </Form.Item>

            {/* TODO: check if it can be removed
              <DFormSelectWidget
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
          </div>
          <Form.Item label="Title" name="field-title" className="dform-field mb-2">
            <NmpInput
              id={"field-title"}
              type="text"
              value={element.title}
              disabled={false}
              onChange={(event) => onFieldTitleChange(event.target.value)}
              placeholder="Enter your answer here"
            />
          </Form.Item>
        </>
      )}

      <SpecificFieldProperties element={element} organization={organization} onFieldChange={onFieldChange} />

      <div className="application_delimiter" />

      <div className="d-flex justify-content-between">
        <Form.Item>
          <NmpButton type="default" shape="round" size="large" onClick={onElementChangesCancel}>
            Cancel
          </NmpButton>
        </Form.Item>

        <div className="d-flex">
          <Form.Item>
            <NmpButton className="mr-1" type="primary" danger shape="round" size="large" onClick={onDeleteButtonClick}>
              Delete
            </NmpButton>
          </Form.Item>
          <Form.Item>
            <NmpButton
              type="primary"
              size="large"
              shape="round"
              onClick={onElementChangesSave}
              className="button-success"
            >
              Save
            </NmpButton>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default FieldProperties;
