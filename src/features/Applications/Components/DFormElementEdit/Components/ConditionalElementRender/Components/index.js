import React, { useState } from "react";

import { DFormFieldConditionModel } from "features/Applications/fieldConditionModel";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormDateWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormDateWidget";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

import {
  DCREffectTypes,
  DCREffectLabels,
  DCRSupportedFieldTypes,
  DCRSupportedFieldOperatorsFactory,
} from "../constants";

import { DATE_WIDGET_FORMATS, DateWidgetFormatTypes } from "../../../../../constants";

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

  const onFieldIdChange = ({ value: fieldId }) => updateCondition({ fieldId });

  const onEffectTypeChange = ({ value: effectType }) => updateCondition({ effectType });

  const onOperatorTypeChange = ({ value: operatorType }) => updateCondition({ operatorType });

  const onExpectedValueChange = (expectedValue) => updateCondition({ expectedValue });

  const onFormatChange = (value) => setFormat(value);

  const field = fields.find(({ id }) => id === condition.fieldId);
  const fieldsIdsAsOptions = getFieldIdAsOptions(fields);
  const operators = field ? DCRSupportedFieldOperatorsFactory.build(field.type) : null;
  const operatorsAsOptions = operators ? getOperatorTypesAsOptions(operators) : null;
  const operator = operators ? operators.find(({ type }) => type === condition.operatorType) : null;

  const getExpectedValueField = () => {
    if (field.type === DCRSupportedFieldTypes.Date) {
      return (
        <>
          <DFormDateWidget
            id="dcr-expected-value"
            label={operator.expectedValueTitle}
            value={condition.expectedValue ?? ""}
            format={format.value}
            placeholder="Enter expected value"
            isError={false}
            isRequired={false}
            isDisabled={false}
            isLabelShowing={true}
            onChange={onExpectedValueChange}
            className="mb-2"
          />

          <DFormSelectWidget
            id="dcr-expected-value-date-format"
            label="Expected date format"
            value={format}
            options={DATE_WIDGET_FORMATS.map((format) => ({ value: format, label: format }))}
            isError={false}
            isRequired={false}
            isDisabled={false}
            isLabelShowing={true}
            onChange={onFormatChange}
            placeholder="Select an date Format"
          />
        </>
      );
    }

    return (
      <DFormTextWidget
        id="dcr-expected-value"
        label={operator.expectedValueTitle}
        value={condition.expectedValue ?? ""}
        placeholder="Enter expected value"
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={onExpectedValueChange}
      />
    );
  };

  return (
    <>
      <DFormSelectWidget
        id="dcr-effect-type"
        label="This element will effected by"
        value={condition.effectType != null ? getEffectTypeOption(condition.effectType) : null}
        options={effectTypesAsOptions}
        placeholder="Select an effect"
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={onEffectTypeChange}
        className="mb-2"
      />

      <DFormSelectWidget
        id="dcr-field-id"
        label="If value of field"
        value={condition.fieldId != null ? getFieldIdAsOption(field) : null}
        options={fieldsIdsAsOptions}
        placeholder="Select field"
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={onFieldIdChange}
        className="mb-2"
      />

      {condition.fieldId != null ? (
        <DFormSelectWidget
          id="dcr-effect"
          label="Will be"
          value={condition.operatorType != null ? getOperatorTypeAsOption(operator) : null}
          options={operatorsAsOptions}
          placeholder="Select operator"
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onOperatorTypeChange}
          className="mb-2"
        />
      ) : null}

      {operator && operator.isBinary ? getExpectedValueField() : null}
    </>
  );
};

export default ConditionForm;
