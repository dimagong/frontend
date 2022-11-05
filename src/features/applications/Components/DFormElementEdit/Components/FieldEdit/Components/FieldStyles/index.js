import React, { useState, useEffect } from "react";
import { Form } from "antd";
import _ from "lodash";

import { NmpButton, NmpSelect } from "features/nmp-ui";
import { MULTI_SELECT_UI_STYLES } from "features/applications/constants";
import { DFormBlockSizeTypes, DFormFieldTypes } from "features/dform/types";

const defaultUIStyle = { label: "default", value: null };

const uIStylesOptions = [defaultUIStyle, ...MULTI_SELECT_UI_STYLES.map((value) => ({ label: value, value }))];

const STYLES_CLASSES = {
  [DFormBlockSizeTypes.Half]: "Half width",
  [DFormBlockSizeTypes.Full]: "Full width",
};

const classesOptions = Object.values(DFormBlockSizeTypes).map((className) => ({
  label: STYLES_CLASSES[className],
  value: className,
}));

const FieldStyles = ({ element, onDeleteButtonClick, onFieldSubmit, onElementChangesCancel }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const renderSpecificStyles = () => {
    switch (element.type) {
      case DFormFieldTypes.MultiSelect: {
        return (
          <Form.Item label="UI style" name="uiStyle" className="dform-field mb-2">
            <NmpSelect id="uiStyle" options={uIStylesOptions} placeholder="Select an option" />
          </Form.Item>
        );
      }
      default:
        return null;
    }
  };

  const initialValues = {
    ...element,
    masterSchemaFieldId: element.masterSchemaFieldId || null,
    uiStyle: element.uiStyle ? { label: element.uiStyle, value: element.uiStyle } : defaultUIStyle,
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
    <Form form={form} layout="vertical" onFinish={onFinish} name="styles" onFieldsChange={handleFormChange}>
      <div className="mb-2">
        <Form.Item name="classes" label="Classes" className="dform-field mb-2">
          <NmpSelect id="classes" options={classesOptions} placeholder="Select an option" />
        </Form.Item>
      </div>
      {renderSpecificStyles()}

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

export default FieldStyles;
