import React from "react";
import { Form } from "antd";

import { NmpButton } from "features/nmp-ui";

import ConditionalElementRender from "../../../ConditionalElementRender";

const FieldDynamicRendering = ({
  data,
  element,
  onElementChange,
  onDeleteButtonClick,
  onElementChangesSave,
  onElementChangesCancel,
}) => {
  return (
    <Form layout={"vertical"}>
      <ConditionalElementRender
        fields={Object.values(data.fields)}
        element={element}
        conditions={element.conditions}
        onElementChange={onElementChange}
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
            <NmpButton
              type="primary"
              size="large"
              shape="round"
              onClick={onElementChangesSave}
              className="button-success"
            >
              Save
            </NmpButton>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default FieldDynamicRendering;
