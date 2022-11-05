import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { Button } from "antd";
import _ from "lodash";

import { DFormFieldModel } from "features/applications/fieldModel";

import { useApplicationResourceManagerFields } from "../../../../../../data/applicationQueries";

import { NmpButton, NmpInput, NmpSelect, NmpCheckbox, NmpWysiwygEditor } from "features/nmp-ui";
import {
  DATE_WIDGET_FORMATS,
  ResourceCompileOptionLabel,
  FIELDS_NOT_RELATED_TO_MASTER_SCHEMA,
} from "features/applications/constants";

import MasterSchemaProperty from "components/FormCreate/Fields/MasterSchemaProperty";

import { DFormBlockTypes, DFormFieldTypes } from "features/dform/types";
import { DFormLabel } from "features/dform/ui/DFormLabel";
import { GroupChanger } from "./GroupChanger";

export const FieldRequiredEditProperty = () => {
  return (
    <Form.Item name="isRequired" className="dform-field" valuePropName="checked">
      <NmpCheckbox id="isRequired">
        <DFormLabel label="Is required" isSmall />
      </NmpCheckbox>
    </Form.Item>
  );
};

export const FieldProtectedEditProperty = () => {
  return (
    <Form.Item name="isProtected" className="dform-field" valuePropName="checked">
      <NmpCheckbox id="isProtected">
        <DFormLabel label="Is protected" isSmall />
      </NmpCheckbox>
    </Form.Item>
  );
};

export const FieldLabelShowingEditProperty = () => {
  return (
    <Form.Item name="isLabelShowing" className="dform-field" valuePropName="checked">
      <NmpCheckbox id="isLabelShowing">
        <DFormLabel label="Label showing" isSmall />
      </NmpCheckbox>
    </Form.Item>
  );
};

export const FieldDefaultEditProperties = () => {
  return (
    <Row className="mb-2">
      <Col md="12" className="dform-field__checkbox-default">
        <FieldRequiredEditProperty />
      </Col>
      <Col md="12" className="dform-field__checkbox-default">
        <FieldLabelShowingEditProperty />
      </Col>
      <Col md="12" className="dform-field__checkbox-default">
        <FieldProtectedEditProperty />
      </Col>
    </Row>
  );
};

export const FieldMinMaxEditProperty = () => {
  return (
    <Row className="mb-2">
      <Col md="6">
        <Form.Item label="Minimum" name="minimum" className="dform-field mb-2">
          <NmpInput id="minimum" type="number" placeholder="Enter your answer here" className="dform-number-field" />
        </Form.Item>
      </Col>
      <Col md="6">
        <Form.Item label="Maximum" name="maximum" className="dform-field mb-2">
          <NmpInput id="maximum" type="number" placeholder="Enter your answer here" className="dform-number-field" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export const FieldMinMaxLengthEditProperty = () => {
  return (
    <Row className="mb-2">
      <Col md="6">
        <Form.Item label="Min length" name="minLength" className="dform-field mb-2">
          <NmpInput id="minLength" type="number" placeholder="Enter your answer here" className="dform-number-field" />
        </Form.Item>
      </Col>

      <Col md="6">
        <Form.Item label="Max length" name="maxLength" className="dform-field mb-2">
          <NmpInput id="maxLength" type="number" placeholder="Enter your answer here" className="dform-number-field" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export const FieldStringLikeTextEditProperties = () => {
  return (
    <>
      <FieldMinMaxLengthEditProperty />
      <FieldDefaultEditProperties />
    </>
  );
};

export const FieldDateEditProperties = () => {
  return (
    <>
      <Row className="mb-2">
        <Col md="12">
          <Form.Item label="Date format" name="format" className="dform-field mb-2" rules={[{ required: true }]}>
            <NmpSelect
              id="format"
              options={DATE_WIDGET_FORMATS.map((format) => ({ value: format, label: format }))}
              placeholder="Select an date Format"
            />
          </Form.Item>
        </Col>
      </Row>

      <FieldDefaultEditProperties />
    </>
  );
};

export const FieldSelectOptionItem = ({ index, value, onOptionRemove, onOptionChange, ...field }) => {
  const onChange = (value) => {
    onOptionChange({ value, index });
  };

  return (
    <div className="d-flex py-1">
      <div className="width-80-per">
        <Form.Item {...field} className="dform-field mb-2">
          <NmpInput
            id={`option-${value}`}
            type="text"
            defaultValue={value}
            placeholder="Enter your option here"
            onChange={(event) => onChange(event.target.value)}
          />
        </Form.Item>
      </div>

      <div className="d-flex justify-content-end width-20-per">
        <Button size="sm" color="danger" onClick={() => onOptionRemove(field.name)}>
          X
        </Button>
      </div>
    </div>
  );
};

export const FieldSelectOptionsEditProperty = ({ element }) => {
  const [options, setOptions] = useState(element.options || []);

  const initialValue = options.map((option) => ({ id: `option-${option}`, name: `option-${option}` }));

  const onOptionChange = (newOption) => {
    const newOptions = _.clone(options);

    if (options.filter((option) => option === newOption.value).length > 0) {
      toast.warn(`The option should be unique. There is a duplicated option: "${newOption.value}"`);
    }

    newOptions[newOption.index] = newOption.value;

    setOptions(newOptions);
  };

  return (
    <Row className="mb-2">
      <Form.List name="options" initialValue={initialValue}>
        {(fields, { add, remove }) => (
          <>
            <Col md="12">
              {fields.length > 0 ? (
                fields.map((field, index) => (
                  <FieldSelectOptionItem
                    index={index}
                    onOptionChange={onOptionChange}
                    onOptionRemove={remove}
                    {...field}
                  />
                ))
              ) : (
                <div className="py-1 text-center">There are no options.</div>
              )}
              {}
            </Col>
            <Col md="12">
              <div className="d-flex justify-content-center">
                <Button color="primary" onClick={() => add()}>
                  Add
                </Button>
              </div>
            </Col>
          </>
        )}
      </Form.List>
    </Row>
  );
};

export const FieldSelectEditProperties = ({ element }) => {
  return (
    <>
      <FieldSelectOptionsEditProperty element={element} />
      <FieldDefaultEditProperties />
    </>
  );
};

export const FieldNumberEditProperties = () => {
  return (
    <>
      <FieldMinMaxEditProperty />
      <FieldDefaultEditProperties />
    </>
  );
};

export const FieldHelpTextEditProperties = () => {
  return (
    <Row>
      <Col md="12" className="mb-2">
        <Form.Item name="helpTextValue" className="dform-field mb-2">
          <NmpWysiwygEditor />
        </Form.Item>
      </Col>

      <Col md="12">
        <FieldProtectedEditProperty />
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

export const FieldResourceEditProperties = ({ element, organization }) => {
  const queryParams = { organizationId: organization.id, organizationType: organization.type };
  const { isLoading, data: options = [] } = useApplicationResourceManagerFields(queryParams, queryConfig);

  element = DFormFieldModel.from(element);

  return (
    <>
      <Row className="mb-2">
        <Col md="12">
          <Form.Item
            label="Resource link"
            name="resourceManagerFieldId"
            className="dform-field mb-2"
            rules={[{ required: true }]}
          >
            <NmpSelect
              id="resourceManagerFieldId"
              isLoading={isLoading}
              options={options}
              placeholder="Select a resource field"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md="12">
          <Form.Item
            label="Resource compile option"
            name="resourceCompileOption"
            className="dform-field mb-2"
            rules={[{ required: true }]}
          >
            <NmpSelect
              id="resourceCompileOption"
              options={[
                {
                  value: element.resourceCompileOption,
                  label: ResourceCompileOptionLabel[element.resourceCompileOption],
                },
              ]}
              isLoading={isLoading}
              placeholder="Select a resource compile option"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md="12" className="mb-2">
          <FieldLabelShowingEditProperty />
        </Col>
        <Col md="12">
          <FieldProtectedEditProperty />
        </Col>
      </Row>
    </>
  );
};

export const SpecificFieldProperties = ({ element, organization, elementType }) => {
  switch (elementType) {
    case DFormFieldTypes.Text:
    case DFormFieldTypes.LongText:
    case DFormFieldTypes.TextArea:
      return <FieldStringLikeTextEditProperties />;
    case DFormFieldTypes.Date:
      return <FieldDateEditProperties />;
    case DFormFieldTypes.Select:
    case DFormFieldTypes.MultiSelect:
      return <FieldSelectEditProperties element={element} />;
    case DFormFieldTypes.Number:
      return <FieldNumberEditProperties />;
    case DFormBlockTypes.HelpText:
      return <FieldHelpTextEditProperties />;
    case DFormBlockTypes.Resource:
      return <FieldResourceEditProperties element={{ ...element, type: elementType }} organization={organization} />;
    case DFormFieldTypes.File:
    case DFormFieldTypes.FileList:
    case DFormFieldTypes.Boolean:
    default:
      return <FieldDefaultEditProperties />;
  }
};

const FieldProperties = (props) => {
  const { element, organization, data, onDeleteButtonClick, onElementChangesCancel, onFieldSubmit } = props;

  const [form] = Form.useForm();
  const [type, setType] = useState(element.type);
  const [disabled, setDisabled] = useState(true);

  const elementFieldModel = DFormFieldModel.from(element);

  const initialValues = {
    ...element,
    ...elementFieldModel,
    format: element.format ? { value: element.format, label: element.format } : null,
    // groupId: {value: element.groupId, label: data.groups[element.groupId].name},
    type: element.type,
    masterSchemaFieldId: element.masterSchemaFieldId || null,
  };

  useEffect(() => {
    setDisabled(true);
    setType(element.type);

    form.setFieldsValue(initialValues);
  }, [element]);

  const onFinish = (submittedObj) => {
    _.forOwn(submittedObj, (value, key) => {
      if (value?.value) {
        submittedObj[key] = value.value;
      }
    });

    onFieldSubmit(submittedObj);
  };

  const onTypeChange = (newType) => {
    setType(newType);
  };

  const handleFormChange = () => {
    const fieldsValue = form.getFieldsValue();

    const fieldsKeys = Object.keys(fieldsValue);

    setDisabled(true);

    fieldsKeys.forEach((key) => {
      if (!_.isEqual(fieldsValue[key], initialValues[key])) {
        setDisabled(false);
        return;
      }
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} name="properties" onFieldsChange={handleFormChange}>
      <Form.Item label="Group" name="groupId" className="dform-field">
        <GroupChanger id="groupId" data={data} />
      </Form.Item>

      <Form.Item label="Element type" name="type" className="dform-field mb-2">
        <NmpSelect
          id="type"
          options={[...Object.values(DFormFieldTypes), DFormBlockTypes.HelpText, DFormBlockTypes.Resource].map(
            (type) => ({ value: type, label: type })
          )}
          disabled={false}
          placeholder="Select an Element type"
          onChange={onTypeChange}
        />
      </Form.Item>

      {/* TODO: check if it can be removed
       <Form.Item label="Element group" name="groupId" className="dform-field mb-2">
        <NmpSelect
          id="groupId"
          disabled={false}
          placeholder="Select an Element group"
          options={Object.values(data.groups).map((group) => ({ value: group.id, label: group.name }))}
          onChange={(_, option) => onFieldGroupChange(option)}
        />
      </Form.Item> */}

      {FIELDS_NOT_RELATED_TO_MASTER_SCHEMA.includes(type) ? null : (
        <>
          <div className="mb-2">
            <Form.Item
              label="Input name (reference)"
              name="masterSchemaFieldId"
              rules={[{ required: true }]}
              className="dform-field mb-2"
            >
              <MasterSchemaProperty id="masterSchemaFieldId" organizations={[organization]} />
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
          <Form.Item label="Title" name="title" className="dform-field mb-2">
            <NmpInput id="title" type="text" placeholder="Enter your answer here" />
          </Form.Item>
        </>
      )}

      <SpecificFieldProperties element={element} elementType={type} organization={organization} />

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
              className="button-success"
              type="primary"
              shape="round"
              size="large"
              htmlType="submit"
              disabled={disabled}
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