import React, { useState } from "react";

import "./styles.scss";
import { Button } from "reactstrap";
import FieldLabel from "../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/FieldLabel";
import Select from "react-select";
import { colourStyles } from "../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";
import TextWidget from "../../../../../../components/FormCreate/Custom/TextWidget";
import { EFFECTS, OPERANDS, CONDITIONS_BY_SELECTED_FIELD_TYPE } from "./constants";
import ConditionForm from "./Components";

const ConditionalElementRender = ({ onConditionAdd, conditions = [], fieldSectionFields = [] }) => {
  const handleConditionAdd = () => {
    onConditionAdd();
  };

  return (
    <div className="conditional-element-render">
      {!conditions.length ? (
        <div className="conditional-element-render_no-conditions">There are no conditions for this element</div>
      ) : (
        <div>
          {conditions.map((condition, index) => (
            <div>
              <div className={"conditional-element-render_condition-title"}>Condition {index + 1}</div>
              <ConditionForm conditionData={condition} fieldSectionFields={fieldSectionFields} />
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
