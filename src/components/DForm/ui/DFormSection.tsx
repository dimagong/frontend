import React, { useEffect } from "react";
import { Form, FormProps } from "antd";
import type { FC, ReactNode } from "react";

import Groups from "../Components/Groups";
import { DFormSchema } from "../types/dformSchema";

const validateMessages = {
  required: "Is required!",
};

type Props = {
  id: string;
  schema: DFormSchema;
  actions?: ReactNode;
  isHidden: boolean;
  isDisabled: boolean;
  relatedGroups: Array<string>;
  initialValues?: FormProps["initialValues"];
  selectedElement?: any;
  onFieldCreate?: (groupId: string) => void;
  onGroupCreate?: (sectionId: string) => void;
  onElementClick?: (el: any, type: "field" | "group" | "section") => void;
};

export const DFormSection: FC<Props> = (props) => {
  const {
    id,
    schema,
    actions,
    isHidden = false,
    isDisabled = false,
    relatedGroups,
    initialValues,
    selectedElement,
    onGroupCreate: propOnGroupCreate,
    onFieldCreate,
    onElementClick,
  } = props;

  const [form] = Form.useForm();

  const onGroupCreate = () => {
    if (propOnGroupCreate) {
      propOnGroupCreate(id);
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <Form form={form} name={id} layout="vertical" initialValues={initialValues} validateMessages={validateMessages}>
      <Groups
        data={schema}
        sectionId={id}
        isDisabled={isDisabled}
        selectedElement={selectedElement}
        sectionGroups={relatedGroups}
        onGroupCreate={onGroupCreate}
        onFieldCreate={onFieldCreate}
        onElementClick={onElementClick}
      />
      {actions}
    </Form>
  );
};
