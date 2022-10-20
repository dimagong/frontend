import React, { useEffect } from "react";
import { Form, FormProps } from "antd";
import type { FC, ReactNode } from "react";

import Groups from "../Components/Groups";
import { DFormSchema } from "../types/dformSchema";

const validateMessages = {
  required: "Is required!",
  string: {
    len: "value must be exactly ${len} characters",
    min: "value must be at least ${min} characters",
    max: "value cannot be longer than ${max} characters",
    range: "value must be between ${min} and ${max} characters",
  },
  number: {
    len: "value must equal ${len}",
    min: "value cannot be less than ${min}",
    max: "value cannot be greater than ${max}",
    range: "value must be between ${min} and ${max}",
  },
  array: {
    len: "value must be exactly ${len} in length",
    min: "value cannot be less than ${min} in length",
    max: "value cannot be greater than ${max} in length",
    range: "value must be between ${min} and ${max} in length",
  },
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

  const onGroupCreate = () => {
    if (propOnGroupCreate) {
      propOnGroupCreate(id);
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <Form
      name={id}
      layout="vertical"
      initialValues={initialValues}
      validateMessages={validateMessages}
      scrollToFirstError
    >
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
