import React, { useState, useEffect } from "react";
import { Form } from "antd";
import _ from "lodash";

import { NmpButton, NmpInput, NmpCheckbox } from "features/nmp-ui";

import { DFormLabel } from "components/DForm/ui/DFormLabel";

import { SectionChanger } from "./SectionChanger";

const GroupProperties = ({ element, onFieldSubmit, onDeleteButtonClick, onElementChangesCancel, data }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const initialValues = {
    ...element,
  };

  useEffect(() => {
    setDisabled(true);

    form.setFieldsValue(initialValues);
  }, [element]);

  const onFinish = (submittedObj) => {
    _.forOwn(submittedObj, (value, key) => {
      if (value?.value) {
        submittedObj[key] = value.value;
      }
    });

    onFieldSubmit(submittedObj);
  };

  const handleFormChange = () => {
    const fieldsValue = form.getFieldsValue();

    const fieldsKeys = Object.keys(fieldsValue);

    setDisabled(true);

    fieldsKeys.forEach((key) => {
      if (!_.isEqual(fieldsValue[key], initialValues[key])) {
        setDisabled(false);
        return;
      }
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} name="properties" onFieldsChange={handleFormChange}>
      <Form.Item label="Section" name="sectionId" className="dform-field">
        <SectionChanger id="sectionId" data={data} />
      </Form.Item>

      <Form.Item label="Group name" name="name" className="dform-field mb-2">
        <NmpInput id="name" type="text" placeholder="Enter your answer here" />
      </Form.Item>

      <Form.Item name="isProtected" className="dform-field mb-2" valuePropName="checked">
        <NmpCheckbox id="isProtected">
          <DFormLabel label="Is protected" isSmall />
        </NmpCheckbox>
      </Form.Item>

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
