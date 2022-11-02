import React from "react";
import { Form } from "antd";

import { NmpInput, NmpButton } from "features/nmp-ui";

import { ApplicationData } from "../models";

export const AHCreateCategoryForm: React.FC<Props> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical" name="createCategory">
      <Form.Item label="Name" name="name" className="dform-field mb-2" rules={[{ required: true }]}>
        <NmpInput id="name" type="text" placeholder="Enter application name" />
      </Form.Item>

      <Form.Item className="d-flex justify-content-end mb-2">
        <NmpButton className="button-success" type="primary" size="large" htmlType="submit">
          Save
        </NmpButton>
      </Form.Item>
    </Form>
  );
};

type Props = {
  onSubmit: (submitted: ApplicationData) => void;
};
