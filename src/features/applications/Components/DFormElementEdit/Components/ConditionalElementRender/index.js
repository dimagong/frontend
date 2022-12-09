import "./styles.scss";

import React from "react";
import { Form } from "antd";
import { X } from "react-feather";
import { Button } from "reactstrap";

import { preventDefault } from "utility/event-decorators";

import { DFormFieldConditionModel } from "../../../../fieldConditionModel";

import ConditionForm from "./Components";
import { DCRSupportedFieldTypes } from "./constants";

const ConditionItem = ({ condition, fields, onDelete, name, relatedFields, elementType, ...restField }) => {
  return (
    <div className="mb-1">
      <div className="conditional-element-render_condition-title">
        <div>Condition</div>
        <button onClick={preventDefault(() => onDelete(name))}>
          <X size={22} />
        </button>
      </div>
      <ConditionForm
        condition={condition}
        elementType={elementType}
        relatedFields={relatedFields}
        fields={fields}
        name={name}
        {...restField}
      />
    </div>
  );
};

const ConditionalElementRender = ({ fields: propFields = [], elementType, relatedFields, elementId, conditions }) => {
  // When a field's condition effects on itself, it might lead to recursion.
  // So, to prevent condition creation on itself, in case when element type is
  // field filter the element from fields. Also filter only supported DCR fields.

  const onConditionDelete = (deleteFunction, id) => {
    if (!window.confirm("Are you sure you want to delete this condition?")) {
      return;
    }

    deleteFunction(id);
  };

  const filteredFields = propFields
    .filter((field) => field.id !== elementId)
    .filter((field) => DCRSupportedFieldTypes[field.type] !== undefined);

  return (
    <Form.List name="conditions">
      {(fields, { add, remove }) => (
        <>
          {fields.length > 0 ? (
            fields.map(({ key, name, ...restField }, index) => (
              <ConditionItem
                elementType={elementType}
                relatedFields={relatedFields}
                fields={filteredFields}
                condition={conditions?.[name]}
                index={index}
                onDelete={(id) => onConditionDelete(remove, id)}
                key={key}
                name={name}
                {...restField}
              />
            ))
          ) : (
            <div className="conditional-element-render_no-conditions">There are no conditions for this element</div>
          )}
          <div className="d-flex justify-content-center">
            <Button color="primary" onClick={() => add({ ...DFormFieldConditionModel.create() })}>
              Add condition
            </Button>
          </div>
        </>
      )}
    </Form.List>
  );
};

export default ConditionalElementRender;
