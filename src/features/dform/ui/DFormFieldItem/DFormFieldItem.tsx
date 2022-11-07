import "./styles.scss";

import React from "react";
import { Form } from "antd";
import type { FC } from "react";
import type { FormItemProps } from "antd";

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

  const numberValidator = async (_, value: unknown) => {
    const valueAsNumber = Number(value);

    if (Number.isNaN(valueAsNumber)) {
      return Promise.reject(`value must be numeric!`);
    }

    if (minimum !== undefined && maximum !== undefined) {
      return valueAsNumber >= minimum && valueAsNumber <= maximum
        ? Promise.resolve()
        : Promise.reject(`value must be between ${minimum} and ${maximum}!`);
    }
    if (minimum !== undefined) {
      valueAsNumber >= minimum ? Promise.resolve() : Promise.reject(`value must be at least ${minimum}!`);
    }
    if (maximum !== undefined) {
      valueAsNumber <= maximum ? Promise.resolve() : Promise.reject(`value cannot be longer than ${maximum}!`);
    }
  };

  const rules: FormItemProps["rules"] = [{ required: isRequired }, { min: minLength, max: maxLength }];

  if (minimum !== undefined || maximum !== undefined) {
    rules.push({ validator: numberValidator });
  }

  return (
    <Form.Item name={name} rules={rules} required={isRequired} className="dform-field-item">
      {children}
    </Form.Item>
  );
};
