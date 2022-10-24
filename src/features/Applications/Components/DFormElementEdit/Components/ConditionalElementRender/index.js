import "./styles.scss";

import React from "react";
import { X } from "react-feather";
import { Button } from "reactstrap";
import { Col, Form } from "antd";

import { ElementTypes } from "components/DForm";

import { DFormFieldConditionModel } from "features/Applications/fieldConditionModel";

import ConditionForm from "./Components";
import { DCRSupportedFieldTypes } from "./constants";

const ConditionItem = ({ condition, fields, onDelete, onChange, name, ...restField }) => {
  return (
    <div className="mb-1">
      <div className="conditional-element-render_condition-title">
        <div>Condition</div>
        <button onClick={() => onDelete(condition.id)}>
          <X size={22} />
        </button>
      </div>
      <ConditionForm onConditionChange={onChange} condition={condition} fields={fields} name={name} {...restField} />
    </div>
  );
};

const ConditionalElementRender = ({ conditions = [], fields: propFields = [], element, onElementChange }) => {
  // When a field's condition effects on itself, it might lead to recursion.
  // So, to prevent condition creation on itself, in case when element type is
  // field filter the element from fields. Also filter only supported DCR fields.
  const fields =
    element.elementType === ElementTypes.Field
      ? propFields
          .filter((field) => field.id !== element.id)
          .filter((field) => DCRSupportedFieldTypes[field.type] !== undefined)
      : propFields;

  const updateElementCondition = (conditions) => onElementChange({ ...element, conditions });

  const onConditionAdd = () => {
    const condition = DFormFieldConditionModel.create();
    const newConditions = [...element.conditions, condition];
    updateElementCondition(newConditions);
  };

  const onConditionDelete = (conditionId) => {
    if (!window.confirm("Are you sure you want to delete this condition?")) return;

    const filteredConditions = element.conditions.filter((condition) => condition.id !== conditionId);

    updateElementCondition(filteredConditions);
  };

  const onConditionChange = (changedCondition) => {
    const changedConditions = conditions.map((condition) => {
      return condition.id === changedCondition.id ? changedCondition : condition;
    });

    updateElementCondition(changedConditions);
  };

  console.log("conditions", conditions);

  conditions = [
    {
      id: "5681f583-8f69-47a2-8ed5-8620ac3a9a5e",
      fieldId: "de2ce438-4cee-4b89-bd79-2fc476c69dd2",
      effectType: 2,
      operatorType: 2,
      expectedValue: "5",
    },
    {
      id: "5681f583-8f69-47a2-8ed5-8620ac3a9a11",
      fieldId: "de2ce438-4cee-4b89-bd79-2fc476c69d11",
      effectType: 1,
      operatorType: 2,
      expectedValue: "5",
    },
  ];
  // conditions = [
  //   { first: "", last: "" },
  //   { first: "", last: "" },
  //   { first: "", last: "" },
  // ];

  const myFields = fields;

  // const initialValue = conditions.map((option) => ({ id: `option-${option}`, name: `option-${option}` }));

  return (
    <Form.List name="options" initialValue={conditions}>
      {(fields, { add, remove }) => (
        <>
          {fields.length > 0 ? (
            fields.map(({ key, name, ...restField }) => (
              <ConditionItem
                fields={myFields}
                condition={conditions}
                onDelete={remove}
                onChange={onConditionChange}
                key={myFields.id}
                name={name}
                {...restField}
              />
            ))
          ) : (
            <div className="conditional-element-render_no-conditions">There are no conditions for this element</div>
          )}
          <div className="d-flex justify-content-center">
            <Button color="primary" onClick={() => add({ effectType: "1" })}>
              Add condition
            </Button>
          </div>
        </>
      )}
    </Form.List>
  );
};

export default ConditionalElementRender;
