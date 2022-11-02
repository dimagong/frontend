import React from "react";
import { Form } from "antd";
import type { FC } from "react";
import type { FormItemProps } from "antd";

type Props = Omit<FormItemProps, "required" | "name" | "noStyle" | "label"> & {
  isRequired: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId: number;
};

export const DFormItem: FC<Props> = (props) => {
  const { rules, isRequired, isLabelShowing, masterSchemaFieldId, children, ...rest } = props;

  return (
    <Form.Item
      name={masterSchemaFieldId}
      required={isRequired}
      rules={[{ required: isRequired }, ...(rules ? rules : [])]}
      {...rest}
    >
      {children}
    </Form.Item>
  );
};
