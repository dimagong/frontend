import React from "react";
import { Form, FormProps } from "antd";
import type { FC, ReactNode } from "react";

import { DFormBaseSection, DFromBaseProps } from "./DFormBaseSection";

const validateMessages = {
  required: "Is required!",
};

type Props = Omit<DFromBaseProps, "selectedElement" | "onGroupCreate" | "onFieldCreate" | "onElementClick"> & {
  actions?: ReactNode;
  initialValues?: FormProps["initialValues"];
};

export const DFormSection: FC<Props> = (props) => {
  const { schema, actions, isHidden = false, sectionId, isDisabled = false, relatedGroups, initialValues } = props;

  return (
    <Form name={sectionId} layout="vertical" initialValues={initialValues} validateMessages={validateMessages}>
      <DFormBaseSection
        schema={schema}
        isHidden={isHidden}
        sectionId={sectionId}
        isDisabled={isDisabled}
        relatedGroups={relatedGroups}
      />
      {actions}
    </Form>
  );
};
