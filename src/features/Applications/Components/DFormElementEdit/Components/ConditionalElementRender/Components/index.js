import React, { useState } from "react";
import FieldLabel from "../../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/FieldLabel";
import Select from "react-select";
import { colourStyles } from "../../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";
import { CONDITIONS_BY_SELECTED_FIELD_TYPE, EFFECTS, EFFECT_LABELS } from "../constants";
import TextWidget from "../../../../../../../components/FormCreate/Custom/TextWidget";

const preparedEffects = Object.values(EFFECTS).map((effect) => ({ value: effect, label: EFFECT_LABELS[effect] }));

const ConditionForm = ({ condition, fieldSectionFields }) => {
  const [conditionData, setConditionData] = useState({ ...condition });

  const handleEffectSelect = (effect) => {
    setConditionData({ ...conditionData, effect: effect.value });
  };

  const handleFieldSelect = (field) => {
    setConditionData({ ...conditionData, field: field.value });
  };

  const handleOperandSelect = (condition) => {
    setConditionData({
      ...conditionData,
      condition: condition.value,
    });
  };

  const handleExpectedValueChange = (expectedValue) => {
    setConditionData({ ...conditionData, expectedValue });
  };

  const conditionBySelectedField = CONDITIONS_BY_SELECTED_FIELD_TYPE[conditionData?.field?.type] || {};

  return (
    <div className="conditional-element-render_condition">
      <div className={"custom-react-select mb-2"}>
        <FieldLabel label={"This element will be"} />
        <Select
          maxMenuHeight={175}
          isDisabled={false}
          styles={colourStyles}
          isMulti={false}
          name="colors"
          value={
            conditionData.effect ? { value: conditionData.effect, label: EFFECT_LABELS[conditionData.effect] } : null
          }
          onChange={handleEffectSelect}
          options={preparedEffects}
          className="React"
          classNamePrefix="select"
          placeholder={"Select an effect"}
        />
      </div>
      <div className={"custom-react-select mb-2"}>
        <FieldLabel label={"If value of field"} />
        <Select
          maxMenuHeight={175}
          isDisabled={false}
          styles={colourStyles}
          isMulti={false}
          name="colors"
          value={conditionData.field ? { value: conditionData.field, label: conditionData.field.title } : null}
          onChange={handleFieldSelect}
          options={fieldSectionFields.map((field) => ({ value: field, label: field.title }))}
          className="React"
          classNamePrefix="select"
          placeholder={"Select field"}
        />
      </div>
      {!!conditionData.field && (
        <div className={"custom-react-select mb-2"}>
          <FieldLabel label={"Will be"} />
          <Select
            maxMenuHeight={175}
            isDisabled={false}
            styles={colourStyles}
            isMulti={false}
            name="colors"
            value={
              conditionData.condition
                ? { value: conditionData.condition, label: conditionData.condition.operandName }
                : null
            }
            onChange={handleOperandSelect}
            options={conditionBySelectedField.map((condition) => ({ value: condition, label: condition.operandName }))}
            className="React"
            classNamePrefix="select"
            placeholder={"Select operand"}
          />
        </div>
      )}
      {!!conditionData.condition && conditionData.condition?.expectedValueTitle && (
        <TextWidget
          value={conditionData.expectedValue || ""}
          label={conditionData.condition.expectedValueTitle}
          placeholder={"Enter expected value"}
          onChange={handleExpectedValueChange}
        />
      )}
    </div>
  );
};

export default ConditionForm;
