import "./styles.scss";

import React, { FC } from "react";
import classnames from "classnames";
import { Form, FormItemProps } from "antd";

import { DFormLabel } from "../DFormLabel";

type Props = Omit<FormItemProps, "required"> & {
  isRequired?: boolean;
  isLabelShowing?: boolean;
};

export const DFormItem: FC<Props> = (props) => {
  const { name, label, isRequired = false, isLabelShowing = true, className, children, ...rest } = props;

  return (
    <Form.Item
      name={name}
      label={isLabelShowing ? <DFormLabel label={label} /> : undefined}
      required={isRequired}
      rules={[{ required: isRequired }]}
      className={classnames(className, "dform-item")}
      {...rest}
    >
      {children}
    </Form.Item>
  );
};
