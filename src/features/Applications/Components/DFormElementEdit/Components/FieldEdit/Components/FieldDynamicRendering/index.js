import React, { useState, useEffect } from "react";
import { Form } from "antd";
import _ from "lodash";

import { NmpButton } from "features/nmp-ui";

import ConditionalElementRender from "../../../ConditionalElementRender";

const FieldDynamicRendering = ({
  data,
  element: elementProps,
  onDeleteButtonClick,
  onElementChangesCancel,
  onFieldSubmit,
}) => {
  const [element, setElement] = useState(elementProps);

  useEffect(() => {
    setElement(elementProps);
  }, [elementProps]);

  const onChange = (newElement) => {
    setElement(newElement);
  };

  const onFinish = (submittedObj) => {
    onFieldSubmit(element);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} name="dynamic-rendering">
      <ConditionalElementRender
        fields={Object.values(data.fields)}
        element={element}
        conditions={element.conditions}
        onElementChange={onChange}
      />

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
            <NmpButton className="button-success" type="primary" shape="round" size="large" htmlType="submit">
              Save
            </NmpButton>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default FieldDynamicRendering;
