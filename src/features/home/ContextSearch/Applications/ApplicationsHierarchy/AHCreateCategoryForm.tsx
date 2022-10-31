import PropTypes from "prop-types";
import React, { useState } from "react";

import { NmpInput, NmpButton } from "features/nmp-ui";
import { Form } from "antd";

export const AHCreateCategoryForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const handleFormChange = () => {
    const name = form.getFieldValue("name");

    if (name.trim() !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical" name="createCategory" onFieldsChange={handleFormChange}>
      <Form.Item label="Name" name="name" className="dform-field mb-2" rules={[{ required: true }]}>
        <NmpInput id="name" type="text" placeholder="Enter application name" />
      </Form.Item>

      <Form.Item className="d-flex justify-content-end mb-2">
        <NmpButton className="button-success" type="primary" size="large" htmlType="submit" disabled={disabled}>
          Save
        </NmpButton>
      </Form.Item>
    </Form>
  );
};

AHCreateCategoryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
