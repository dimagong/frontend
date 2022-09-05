import React from "react";

import { DFormFieldConditionModel } from "features/Applications/fieldConditionModel";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

import { DCREffectLabels, DCREffects, DCRFieldTypesOperatorTemplates } from "../constants";

const getEffectTypeOption = (effectType) => ({ value: effectType, label: DCREffectLabels[effectType] });
const effectTypesAsOptions = DCREffects.map(getEffectTypeOption);

const getFieldIdAsOption = (field) => ({ value: field.id, label: field.title });
const getFieldIdAsOptions = (fields) => fields.map(getFieldIdAsOption);

const getOperatorTypeAsOption = (operatorTemplate) => ({ value: operatorTemplate.type, label: operatorTemplate.name });
const getOperatorTypesAsOptions = (operatorTemplates) => operatorTemplates.map(getOperatorTypeAsOption);

const ConditionForm = ({ fields, condition, onConditionChange }) => {
  const updateCondition = (data) => {
    const updatedCondition = DFormFieldConditionModel.from({ ...condition, ...data });
    onConditionChange(updatedCondition);
  };

  const onFieldIdChange = ({ value: fieldId }) => updateCondition({ fieldId });

  const onEffectTypeChange = ({ value: effectType }) => updateCondition({ effectType });

  const onOperatorTypeChange = ({ value: operatorType }) => updateCondition({ operatorType });

  const onExpectedValueChange = (expectedValue) => updateCondition({ expectedValue });

  const field = fields.find(({ id }) => id === condition.fieldId);
  const fieldsIdsAsOptions = getFieldIdAsOptions(fields);
  const operatorTemplates = field ? DCRFieldTypesOperatorTemplates[field.type] : null;
  const operatorTemplatesAsOptions = operatorTemplates ? getOperatorTypesAsOptions(operatorTemplates) : null;
  const operatorTemplate = operatorTemplates
    ? operatorTemplates.find(({ type }) => type === condition.operatorType)
    : null;

  return (
    <>
      <DFormSelectWidget
        id="dcr-effect-type"
        label="This element will be"
        value={condition.effectType ? getEffectTypeOption(condition.effectType) : null}
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
        value={condition.fieldId ? getFieldIdAsOption(field) : null}
        options={fieldsIdsAsOptions}
        placeholder="Select field"
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={onFieldIdChange}
        className="mb-2"
      />

      {condition.fieldId ? (
        <DFormSelectWidget
          id="dcr-effect"
          label="Will be"
          value={condition.operatorType ? getOperatorTypeAsOption(operatorTemplate) : null}
          options={operatorTemplatesAsOptions}
          placeholder="Select operator"
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onOperatorTypeChange}
          className="mb-2"
        />
      ) : null}

      {condition.operatorType && operatorTemplate.expectedValueTitle ? (
        <DFormTextWidget
          id="dcr-expected-value"
          label={operatorTemplate.expectedValueTitle}
          value={condition.expectedValue ?? ""}
          placeholder="Enter expected value"
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onExpectedValueChange}
        />
      ) : null}
    </>
  );
};

export default ConditionForm;
