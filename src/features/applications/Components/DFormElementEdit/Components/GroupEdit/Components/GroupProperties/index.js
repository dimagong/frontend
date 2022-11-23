import { Form } from "antd";
import { isEqual, forOwn } from "lodash";
import React, { useState, useEffect } from "react";
import _ from "lodash";

import { NmpButton, NmpInput, NmpCheckbox } from "features/nmp-ui";

import { DFormLabel } from "features/dform/ui/DFormLabel";

import { SectionChanger } from "./SectionChanger";

import { nameValidator } from "features/dform/data/validators";

const GroupProperties = ({ element, onFieldSubmit, onDeleteButtonClick, onElementChangesCancel, data }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [isProtected, setIsProtected] = useState(() => element.isProtected);

  const initialValues = {
    ...element,
  };

  useEffect(() => {
    setDisabled(true);
    setIsProtected(element.isProtected);

    form.setFieldsValue(initialValues);
  }, [element]);

  const onFinish = (submittedObj) => {
    forOwn(submittedObj, (value, key) => {
      if (value?.value) {
        submittedObj[key] = value.value;
      }
    });

    onFieldSubmit(submittedObj);
  };

  const onValuesChange = (_, values) => {
    setDisabled(true);
    setIsProtected(values.isProtected);

    Object.entries(values).forEach(([key, value]) => {
      if (!isEqual(value, initialValues[key])) {
        setDisabled(false);
      }
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} name="properties" onValuesChange={onValuesChange}>
      <Form.Item label="Section" name="sectionId" className="dform-field">
        <SectionChanger id="sectionId" data={data} />
      </Form.Item>

      <Form.Item
        label="Group name"
        name="name"
        className="dform-field mb-2"
        rules={[{ required: true }, { validator: nameValidator }]}
      >
        <NmpInput id="name" type="text" placeholder="Enter your answer here" />
      </Form.Item>

      <Form.Item name="isProtected" className="dform-field mb-0" valuePropName="checked">
        <NmpCheckbox id="isProtected">
          <DFormLabel label="Is protected" isSmall />
        </NmpCheckbox>
      </Form.Item>

      {isProtected ? (
        <Form.Item name="isVisibleNonManagers" className="dform-field" valuePropName="checked">
          <NmpCheckbox id="isVisibleNonManagers">
            <DFormLabel label="Is visible to non-managers" isSmall />
          </NmpCheckbox>
        </Form.Item>
      ) : null}

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

export default GroupProperties;
