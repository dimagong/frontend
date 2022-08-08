import React from "react";
import { Button } from "reactstrap";
import { X } from "react-feather";

import ConditionForm from "./Components";

import "./styles.scss";

const ConditionalElementRender = ({ onConditionAdd, onConditionDelete, conditions = [], fieldSectionFields = [] }) => {
  const handleConditionAdd = () => {
    onConditionAdd();
  };

  const handleConditionDelete = (conditionIndex) => {
    onConditionDelete(conditionIndex);
  };

  return (
    <div className="conditional-element-render">
      {!conditions.length ? (
        <div className="conditional-element-render_no-conditions">There are no conditions for this element</div>
      ) : (
        <div>
          {conditions.map((condition, index) => (
            <div key={condition.tempId}>
              <div className={"conditional-element-render_condition-title"}>
                <div>Condition {index + 1}</div>
                <X size={22} onClick={() => onConditionDelete(condition.tempId)} />
              </div>
              <ConditionForm condition={condition} fieldSectionFields={fieldSectionFields} />
            </div>
          ))}
        </div>
      )}
      <div className="d-flex justify-content-center">
        <Button color={"primary"} onClick={handleConditionAdd} className={"button button-success"}>
          Add condition
        </Button>
      </div>
    </div>
  );
};

export default ConditionalElementRender;
