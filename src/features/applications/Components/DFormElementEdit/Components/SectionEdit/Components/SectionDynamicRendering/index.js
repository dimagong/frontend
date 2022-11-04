import React, { useState, useEffect } from "react";
import { Form } from "antd";
import _ from "lodash";

import { NmpButton } from "features/nmp-ui";

import ConditionalElementRender from "../../../ConditionalElementRender";

const SectionDynamicRendering = ({ data, element, onDeleteButtonClick, onElementChangesCancel, onFieldSubmit }) => {
  const [conditions, setConditions] = useState(element.conditions);
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const handleFormChange = () => {
    const formConditions = form.getFieldsValue("conditions").conditions;

    // We need to filter array cause antd Form.List remove() sets all fields of the last removed element to undefined
    const filteredConditions = formConditions.filter((condition) => condition.id !== undefined);

    setDisabled(true);
    setConditions(filteredConditions);

    if (!_.isEqual(filteredConditions, element.conditions)) {
      setDisabled(false);
      return;
    }
  };

  useEffect(() => {
    setDisabled(true);

    form.setFieldsValue({ conditions: element.conditions });
  }, [element]);

  const onFinish = (submittedObj) => {
    onFieldSubmit({ ...element, ...submittedObj });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} name="dynamic-rendering" onFieldsChange={handleFormChange}>
      <ConditionalElementRender fields={Object.values(data.fields)} elementId={element.id} conditions={conditions} />

      <div className="application_delimiter" />

      <div className="d-flex justify-content-between">
        <Form.Item>
          <NmpButton type="default" shape="round" size="large" onClick={onElementChangesCancel}>
            Cancel
          </NmpButton>
        </Form.Item>

        <div className="d-flex">
          <Form.Item>
            <NmpButton className="mr-1" type="primary" danger shape="round" size="large" onClick={onDeleteButtonClick}>
              Delete
            </NmpButton>
          </Form.Item>
          <Form.Item>
            <NmpButton
              className="button-success"
              type="primary"
              shape="round"
              size="large"
              htmlType="submit"
              disabled={disabled}
            >
              Save
            </NmpButton>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default SectionDynamicRendering;
