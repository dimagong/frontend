import "./styles.scss";

import React from "react";
import { X } from "react-feather";
import { Button } from "reactstrap";

import { DFormFieldConditionModel } from "features/Applications/fieldConditionModel";

import ConditionForm from "./Components";

const ConditionItem = ({ condition, fields, onDelete, onChange }) => {
  return (
    <>
      <div className="conditional-element-render_condition-title">
        <div>Condition</div>
        <button onClick={() => onDelete(condition.id)}>
          <X size={22} />
        </button>
      </div>
      <ConditionForm onConditionChange={onChange} condition={condition} fields={fields} />
    </>
  );
};

const ConditionalElementRender = ({ conditions = [], fields = [], element, onElementChange }) => {
  const updateElementCondition = (conditions) => onElementChange({ ...element, conditions });

  const onConditionAdd = () => {
    const condition = DFormFieldConditionModel.create();
    const newConditions = [...element.conditions, condition];
    updateElementCondition(newConditions);
  };

  const onConditionDelete = (conditionId) => {
    if (!window.confirm("Are you sure you want to delete this condition?")) return;

    const newConditions = element.conditions.filter((condition) => condition.id !== conditionId);
    updateElementCondition(newConditions);
  };

  const onConditionChange = (condition) => updateElementCondition([condition]);

  return (
    <>
      {conditions.length === 0 ? (
        <div className="conditional-element-render_no-conditions">There are no conditions for this element</div>
      ) : (
        <>
          {conditions.map((condition) => (
            <ConditionItem
              fields={fields}
              condition={condition}
              onDelete={onConditionDelete}
              onChange={onConditionChange}
              key={condition.id}
            />
          ))}
        </>
      )}

      {conditions.length === 0 ? (
        <div className="d-flex justify-content-center">
          <Button color="primary" onClick={onConditionAdd}>
            Add condition
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default ConditionalElementRender;
