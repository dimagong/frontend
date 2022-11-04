import { Form } from "antd";
import React, { useRef, useEffect } from "react";

import { NmpModal, NmpSelect } from "features/nmp-ui";

export const DuplicateApplicationModal = ({ isOpen, onClose, onSubmit, options, onTemplateChange }) => {
  const [form] = Form.useForm();

  const useResetFormOnCloseModal = ({ form, isOpen }) => {
    const prevOpenRef = useRef();
    useEffect(() => {
      prevOpenRef.current = isOpen;
    }, [isOpen]);
    const prevOpen = prevOpenRef.current;

    useEffect(() => {
      if (!isOpen && prevOpen) {
        form.resetFields();
      }
    }, [form, prevOpen, isOpen]);
  };

  useResetFormOnCloseModal({
    form,
    isOpen,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <NmpModal title="Select dForm" visible={isOpen} onOk={onOk} onCancel={onClose} okText="Duplicate">
      <Form form={form} onFinish={onSubmit || null} layout="vertical" name="duplicateForm">
        <Form.Item
          label="Application template to duplicate from"
          name="applicationTemplate"
          className="dform-field mb-2"
          rules={[{ required: true }]}
        >
          <NmpSelect id="applicationTemplate" options={options} onChange={onTemplateChange} />
        </Form.Item>
      </Form>
    </NmpModal>
  );
};
