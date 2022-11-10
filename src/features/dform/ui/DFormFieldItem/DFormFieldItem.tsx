import "./styles.scss";

import React from "react";
import { Form } from "antd";
import type { FC } from "react";
import type { FormItemProps } from "antd";

import { DformNumberFieldModel } from "../../data/models";
import { AbstractDformFieldModel, DformTextValidationFieldModel } from "../../data/models/dformFieldModel";

export type DFormFieldItemProps = {
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  isRequired?: boolean;
  name?: FormItemProps["name"];
  children?: FormItemProps["children"];
};

export const DFormFieldItem: FC<DFormFieldItemProps> = (props) => {
  const { name, minimum, maximum, minLength, maxLength, isRequired = false, children } = props;

  const requiredValidator = (_, value) => {
    const isValid = AbstractDformFieldModel.fieldValidator(value, isRequired);
    return isValid ? Promise.resolve() : Promise.reject("field is required!");
  };
  const numberValidator = (_, value) => {
    const { isValid, message } = DformNumberFieldModel.numberValidator(value, minimum, maximum);
    return isValid ? Promise.resolve() : Promise.reject(message);
  };
  const stringValidator = (_, value) => {
    const { isValid, message } = DformTextValidationFieldModel.stringValidator(value, minLength, maxLength);
    return isValid ? Promise.resolve() : Promise.reject(message);
  };

  const rules: FormItemProps["rules"] = [];

  if (isRequired) {
    rules.push({ validator: requiredValidator });
  }
  if (minLength !== undefined || maxLength !== undefined) {
    rules.push({ validator: stringValidator });
  }

  if (minimum !== undefined || maximum !== undefined) {
    rules.push({ validator: numberValidator });
  }

  return (
    <Form.Item name={name} rules={rules} required={isRequired} className="dform-field-item">
      {children}
    </Form.Item>
  );
};
