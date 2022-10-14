import React, { useState, useEffect } from "react";
import { Form } from "antd";
import _ from "lodash";

import { NmpButton, NmpInput, NpmCheckbox } from "features/nmp-ui";
import { DFormFieldLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormFieldLabel";

const SectionProperties = ({ element, onFieldSubmit, onDeleteButtonClick, onElementChangesCancel }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const initialValues = {
    ...element,
  };

  useEffect(() => {
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
      <Form.Item label="Section name" name="name" className="dform-field mb-2">
        <NmpInput id="name" type="text" placeholder="Section name" />
      </Form.Item>

      <Form.Item name="isProtected" className="dform-field mb-2" valuePropName="checked">
        <NpmCheckbox id="isProtected" label={<DFormFieldLabel label="Is protected" small />} />
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

export default SectionProperties;
