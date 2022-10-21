import "./styles.scss";

import React from "react";
import { Form } from "antd";
import type { FC } from "react";
import classnames from "classnames";
import type { FormItemProps } from "antd";

import { DFormLabel } from "../DFormLabel";

type Props = Omit<FormItemProps, "required"> & {
  isRequired?: boolean;
  isLabelShowing?: boolean;
};

export const DFormItem: FC<Props> = (props) => {
  const { name, label, isRequired = false, isLabelShowing = true, className, children, rules, ...rest } = props;

  return (
    <Form.Item
      name={name}
      label={isLabelShowing ? <DFormLabel label={label} /> : undefined}
      required={isRequired}
      rules={[{ required: isRequired }, ...(rules ? rules : [])]}
      className={classnames(className, "dform-item")}
      {...rest}
    >
      {children}
    </Form.Item>
  );
};
