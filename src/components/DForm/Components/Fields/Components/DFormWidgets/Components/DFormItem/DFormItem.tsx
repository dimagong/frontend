import React, { FC } from "react";
import { Form, FormItemProps } from "antd";

import { DFormLabel } from "../DFormLabel";

type Props = Omit<FormItemProps, "required"> & {
  isRequired?: boolean;
  isLabelShowing?: boolean;
};

export const DFormItem: FC<Props> = (props) => {
  const { name, label, isRequired = false, isLabelShowing = true, children, ...rest } = props;

  return (
    <Form.Item
      name={name}
      label={isLabelShowing ? <DFormLabel label={label} /> : undefined}
      required={isRequired}
      rules={[{ required: isRequired }]}
      {...rest}
    >
      {children}
    </Form.Item>
  );
};
