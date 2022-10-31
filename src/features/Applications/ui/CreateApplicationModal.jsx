import { Form } from "antd";
import React, { useRef, useEffect } from "react";

import { NmpModal } from "features/nmp-ui";

import { ApplicationDescriptionFormFields } from "./ApplicationDescriptionFormFields";

export const CreateApplicationModal = ({ isOpen, onClose, onSubmit }) => {
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
    <NmpModal title="Create a dForm" visible={isOpen} onOk={onOk} onCancel={onClose} okText="Create">
      <Form form={form} onFinish={onSubmit || null} layout="vertical" name="createForm">
        <ApplicationDescriptionFormFields />
      </Form>
    </NmpModal>
  );
};
