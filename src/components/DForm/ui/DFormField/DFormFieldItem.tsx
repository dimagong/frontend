import React from "react";
import { Form } from "antd";
import type { FC } from "react";
import type { FormItemProps } from "antd";

import { DFormFieldTypes } from "../../types";

type Props = {
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  fieldType: DFormFieldTypes;
  isRequired: boolean;
  masterSchemaFieldId: number;
  children?: FormItemProps["children"];
};

export const DFormFieldItem: FC<Props> = (props) => {
  const { minimum, maximum, minLength, maxLength, fieldType, isRequired, masterSchemaFieldId, children } = props;

  const defaultRules = [{ required: isRequired }];
  const defaultProps = { name: masterSchemaFieldId, required: isRequired, rules: defaultRules, children };

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

  switch (fieldType) {
    case DFormFieldTypes.Boolean:
      return <Form.Item {...defaultProps} valuePropName="checked" />;
    case DFormFieldTypes.Text:
    case DFormFieldTypes.TextArea:
    case DFormFieldTypes.LongText:
      return <Form.Item {...defaultProps} rules={[...defaultRules, { min: minLength, max: maxLength }]} />;
    case DFormFieldTypes.Number:
      return <Form.Item {...defaultProps} rules={[...defaultRules, { validator: numberValidator }]} />;
    default:
      return <Form.Item {...defaultProps} />;
  }
};
