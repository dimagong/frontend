import React, { useState } from "react";

import { NmpInput, NmpSelect, NpmDatePicker, NpmTimePicker } from "features/nmp-ui";

import { DFormFieldConditionModel } from "features/Applications/fieldConditionModel";
import { DATE_WIDGET_FORMATS, DateWidgetFormatTypes } from "features/Applications/constants";

import { DFormLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormLabel";

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

const getFieldIdAsOption = (field) => ({ value: field.id, label: field.title });
const getFieldIdAsOptions = (fields) => fields.map(getFieldIdAsOption);

const getOperatorTypeAsOption = (operatorTemplate) => ({ value: operatorTemplate.type, label: operatorTemplate.name });
const getOperatorTypesAsOptions = (operatorTemplates) => operatorTemplates.map(getOperatorTypeAsOption);

const ConditionForm = ({ fields, condition, onConditionChange }) => {
  const [format, setFormat] = useState({ value: DateWidgetFormatTypes.Date, label: DateWidgetFormatTypes.Date });

  const updateCondition = (data) => {
    const updatedCondition = DFormFieldConditionModel.from({ ...condition, ...data });
    onConditionChange(updatedCondition);
  };

  const onFieldIdChange = (fieldId) => updateCondition({ fieldId });

  const onEffectTypeChange = (effectType) => updateCondition({ effectType });

  const onOperatorTypeChange = (operatorType) => updateCondition({ operatorType });

  const onExpectedValueChange = ({ target }) => updateCondition({ expectedValue: target.value });

  const onFormatChange = (_, value) => setFormat(value);

  const field = fields.find(({ id }) => id === condition.fieldId);
  const fieldsIdsAsOptions = getFieldIdAsOptions(fields);
  const operators = field ? DCRSupportedFieldOperatorsFactory.build(field.type) : null;
  const operatorsAsOptions = operators ? getOperatorTypesAsOptions(operators) : null;
  const operator = operators ? operators.find(({ type }) => type === condition.operatorType) : null;

  const Picker = getPicker(format.value);

  const getExpectedValueField = () => {
    if (field.type === DCRSupportedFieldTypes.Date) {
      return (
        <>
          <div className="mb-2">
            <DFormLabel id="dcr-expected-value" label={operator.expectedValueTitle} />
            <Picker
              id="dcr-expected-value"
              value={condition.expectedValue ?? ""}
              placeholder="Enter expected value"
              onChange={onExpectedValueChange}
            />
          </div>

          <div>
            <DFormLabel label="Expected date format" id="dcr-expected-value-date-format" />
            <NmpSelect
              id="dcr-expected-value-date-format"
              value={format}
              options={DATE_WIDGET_FORMATS.map((format) => ({ value: format, label: format }))}
              placeholder="Select an date Format"
              onChange={onFormatChange}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <DFormLabel label={operator.expectedValueTitle} id="dcr-expected-value" />
        <NmpInput
          id="dcr-expected-value"
          type="text"
          value={condition.expectedValue ?? ""}
          placeholder="Enter expected value"
          onChange={onExpectedValueChange}
        />
      </>
    );
  };

  return (
    <>
      <div className="mb-2">
        <DFormLabel label="This element will effected by" id="dcr-effect-type" />
        <NmpSelect
          id="dcr-effect-type"
          value={condition.effectType != null ? getEffectTypeOption(condition.effectType) : null}
          options={effectTypesAsOptions}
          placeholder="Select an effect"
          onChange={onEffectTypeChange}
        />
      </div>

      <div className="mb-2">
        <DFormLabel label="If value of field" id="dcr-field-id" />
        <NmpSelect
          id="dcr-field-id"
          value={condition.fieldId != null ? getFieldIdAsOption(field) : null}
          options={fieldsIdsAsOptions}
          placeholder="Select field"
          onChange={onFieldIdChange}
        />
      </div>

      {condition.fieldId != null ? (
        <div className="mb-2">
          <DFormLabel label="Will be" id="dcr-effect" />
          <NmpSelect
            id="dcr-effect"
            value={condition.operatorType != null ? getOperatorTypeAsOption(operator) : null}
            options={operatorsAsOptions}
            placeholder="Select operator"
            onChange={onOperatorTypeChange}
          />
        </div>
      ) : null}

      {operator && operator.isBinary ? getExpectedValueField() : null}
    </>
  );
};

export default ConditionForm;
