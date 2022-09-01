import React from "react";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

import { EFFECTS, EFFECT_LABELS, OPERATOR_TEMPLATES_BY_SELECTED_FIELD_TYPE } from "../constants";

const preparedEffects = Object.values(EFFECTS).map((effect) => ({ value: effect, label: EFFECT_LABELS[effect] }));

const ConditionForm = ({ condition, fields, onConditionChange }) => {
  const handleEffectSelect = ({ value: effect }) => onConditionChange({ ...condition, effect });

  const handleFieldSelect = ({ value: field }) => onConditionChange({ ...condition, field });

  const handleOperatorSelect = ({ value: operator }) => onConditionChange({ ...condition, operator });

  const handleExpectedValueChange = (expectedValue) => onConditionChange({ ...condition, expectedValue });

  const operatorTemplateBySelectedField = OPERATOR_TEMPLATES_BY_SELECTED_FIELD_TYPE[condition.field?.type] || {};

  return (
    <>
      <DFormSelectWidget
        id="dcr-type"
        label="This element will be"
        value={condition.effect ? { value: condition.effect, label: EFFECT_LABELS[condition.effect] } : null}
        options={preparedEffects}
        placeholder="Select an effect"
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={handleEffectSelect}
        className="mb-2"
      />

      <DFormSelectWidget
        id="dcr-field"
        label="If value of field"
        value={condition.field ? { value: condition.field, label: condition.field.title } : null}
        options={fields.map((field) => ({ value: field, label: field.title }))}
        placeholder="Select field"
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={handleFieldSelect}
        className="mb-2"
      />

      {!!condition.field ? (
        <DFormSelectWidget
          id="dcr-effect"
          label="Will be"
          value={condition.operator ? { value: condition.operator, label: condition.operator.name } : null}
          options={operatorTemplateBySelectedField.map((condition) => ({ value: condition, label: condition.name }))}
          placeholder="Select operator"
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={handleOperatorSelect}
          className="mb-2"
        />
      ) : null}

      {condition.operator && condition.operator.expectedValueTitle ? (
        <DFormTextWidget
          id="dcr-expected-value"
          label={condition.operator.expectedValueTitle}
          value={condition.expectedValue ?? ""}
          placeholder="Enter expected value"
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={handleExpectedValueChange}
        />
      ) : null}
    </>
  );
};

export default ConditionForm;
