import "./styles.scss";

import { v4 } from "uuid";
import React from "react";
import { X } from "react-feather";
import { Button } from "reactstrap";

import { EFFECTS } from "./constants";
import ConditionForm from "./Components";

const ConditionalElementRender = ({ onElementChange, conditions = [], fields = [], element }) => {
  const handleConditionAdd = () => {
    onElementChange({
      ...element,
      conditions: [...(element.conditions || []), { tempId: v4(), effect: EFFECTS[0] }],
    });
  };

  const handleConditionDelete = (conditionTempId) => {
    if (window.confirm("Are you sure you want to delete this condition?")) {
      onElementChange({
        ...element,
        conditions: element.conditions.filter((condition) => condition.tempId !== conditionTempId),
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
            <div key={condition.tempId}>
              <div className={"conditional-element-render_condition-title"}>
                <div>Condition</div>
                <X size={22} onClick={() => handleConditionDelete(condition.tempId)} />
              </div>
              <ConditionForm onConditionChange={handleConditionChange} condition={condition} fields={fields} />
            </div>
          ))}
        </div>
      )}
      {conditions && conditions.length < 1 && (
        <div className="d-flex justify-content-center">
          <Button color={"primary"} onClick={handleConditionAdd} className={"button button-success"}>
            Add condition
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConditionalElementRender;
