import "./styles.scss";

import { v4 } from "uuid";
import React from "react";
import { X } from "react-feather";
import { Button } from "reactstrap";

import ConditionForm from "./Components";
import { INITIAL_CONDITION_DATA } from "./constants";

const ConditionalElementRender = ({ conditions = [], fields = [], element, onElementChange }) => {
  const handleConditionAdd = () => {
    onElementChange({
      ...element,
      conditions: [...(element.conditions || []), { ...INITIAL_CONDITION_DATA, id: v4() }],
    });
  };

  const handleConditionDelete = (conditionId) => {
    if (window.confirm("Are you sure you want to delete this condition?")) {
      onElementChange({
        ...element,
        conditions: element.conditions.filter((condition) => condition.id !== conditionId),
      });
    }
  };

  const handleConditionChange = (conditionData) => {
    onElementChange({ ...element, conditions: [conditionData] });
  };

  return (
    <div className="conditional-element-render">
      {!conditions?.length ? (
        <div className="conditional-element-render_no-conditions">There are no conditions for this element</div>
      ) : (
        <div>
          {conditions.map((condition) => (
            <div key={condition.id}>
              <div className="conditional-element-render_condition-title">
                <div>Condition</div>
                <X size={22} onClick={() => handleConditionDelete(condition.id)} />
              </div>
              <ConditionForm onConditionChange={handleConditionChange} condition={condition} fields={fields} />
            </div>
          ))}
        </div>
      )}

      {conditions.length === 0 ? (
        <div className="d-flex justify-content-center">
          <Button color="primary" onClick={handleConditionAdd}>
            Add condition
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ConditionalElementRender;
