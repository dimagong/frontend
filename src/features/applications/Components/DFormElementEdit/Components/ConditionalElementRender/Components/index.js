import { Form } from "antd";
import React, { useState, useEffect } from "react";

import { NmpInput, NmpSelect, NpmDatePicker, NpmTimePicker } from "features/nmp-ui";
import { DATE_WIDGET_FORMATS, DateWidgetFormatTypes } from "../../../../../constants";

import {
  DCREffectTypes,
  DCREffectLabels,
  DCRSupportedFieldTypes,
  DCRSupportedFieldOperatorsFactory,
} from "../constants";

const getPicker = (dateType) => {
  switch (dateType) {
    case DateWidgetFormatTypes.Time:
      return NpmTimePicker;
    case DateWidgetFormatTypes.Date:
      return NpmDatePicker;
    default:
      throw new Error(`Unsupported date type: '${dateType}'`);
  }
};

const getEffectTypeOption = (effectType) => ({ value: effectType, label: DCREffectLabels[effectType] });
const effectTypesAsOptions = [DCREffectTypes.Visibility, DCREffectTypes.Availability].map(getEffectTypeOption);

const getFieldIdAsOption = (field) => {
  if (!field.id) {
    debugger;
  }
  return { value: field.id, label: field.title };
};
const getFieldIdAsOptions = (fields) => fields.map(getFieldIdAsOption);

const getOperatorTypeAsOption = (operatorTemplate) => ({ value: operatorTemplate.type, label: operatorTemplate.name });
const getOperatorTypesAsOptions = (operatorTemplates) => operatorTemplates.map(getOperatorTypeAsOption);

const ConditionForm = ({ form, condition, fields, name, ...restField }) => {
  const [format, setFormat] = useState(condition?.format || DateWidgetFormatTypes.Date);
  const [fieldId, setFieldId] = useState(condition?.fieldId);
  const [operatorType, setOperatorType] = useState(condition?.operatorType);

  useEffect(() => {
    if (condition) {
      setFieldId(condition.fieldId);
      setOperatorType(condition.operatorType);

      if (condition.format) {
        setFormat(condition.format);
      }
    }
  }, [condition]);

  const onFieldIdChange = (newFieldId) => setFieldId(newFieldId);
  const onOperatorTypeChange = (newOperatorType) => setOperatorType(newOperatorType);
  const onFormatChange = (newFormat) => setFormat(newFormat);

  const field = fields.find(({ id }) => id === fieldId);
  const fieldsIdsAsOptions = getFieldIdAsOptions(fields);
  const operators = field ? DCRSupportedFieldOperatorsFactory.build(field.type) : null;
  const operatorsAsOptions = operators ? getOperatorTypesAsOptions(operators) : null;
  const operator = operators ? operators.find(({ type }) => type === operatorType) : null;

  const Picker = getPicker(format);

  const getExpectedValueField = () => {
    if (field.type === DCRSupportedFieldTypes.Date) {
      return (
        <>
          <Form.Item
            className="mb-2"
            label={operator.expectedValueTitle}
            name={[name, "expectedValue"]}
            rules={[{ required: true }]}
            {...restField}
          >
            <Picker id="expectedValue" placeholder="Enter expected value" />
          </Form.Item>

          <Form.Item
            className="mb-2"
            label="Expected date format"
            name={[name, "format"]}
            rules={[{ required: true }]}
            {...restField}
          >
            <NmpSelect
              id="format"
              options={DATE_WIDGET_FORMATS.map((format) => ({ value: format, label: format }))}
              placeholder="Select an date Format"
              onChange={onFormatChange}
            />
          </Form.Item>
        </>
      );
    }

    return (
      <Form.Item
        className="mb-2"
        label={operator.expectedValueTitle}
        name={[name, "expectedValue"]}
        rules={[{ required: true }]}
        {...restField}
      >
        <NmpInput id="expectedValue" type="text" placeholder="Enter expected value" />
      </Form.Item>
    );
  };

  return (
    <>
      {/* This is hidden id field*/}
      <Form.Item name={[name, "id"]} {...restField} style={{ display: "none" }}>
        <NmpInput id="id" />
      </Form.Item>

      <Form.Item
        className="mb-2"
        label="This element will effected by"
        name={[name, "effectType"]}
        rules={[{ required: true }]}
        {...restField}
      >
        <NmpSelect id="effectType" options={effectTypesAsOptions} placeholder="Select an effect" />
      </Form.Item>

      <Form.Item
        className="mb-2"
        label="If value of field"
        name={[name, "fieldId"]}
        rules={[{ required: true }]}
        {...restField}
      >
        <NmpSelect id="fieldId" options={fieldsIdsAsOptions} onChange={onFieldIdChange} placeholder="Select field" />
      </Form.Item>

      {fieldId !== undefined ? (
        <Form.Item
          className="mb-2"
          label="Will be"
          name={[name, "operatorType"]}
          rules={[{ required: true }]}
          {...restField}
        >
          <NmpSelect
            id="operatorType"
            options={operatorsAsOptions}
            placeholder="Select operator"
            onChange={onOperatorTypeChange}
          />
        </Form.Item>
      ) : null}
      {operator && operator.isBinary ? getExpectedValueField() : null}
    </>
  );
};

export default ConditionForm;
