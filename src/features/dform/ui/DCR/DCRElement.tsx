import React from "react";
import { Form } from "antd";
import type { FunctionComponent, ReactNode, ReactElement } from "react";

import { devWarning, invariant } from "features/common";

import { DformSchemaContext } from "../DformSchemaContext";
import { DformBlockId, DformFieldValueType } from "../../data/models";

import {
  DCREffectProps,
  DCRExpectedValueConvertor,
  DCRFieldValueConvertors,
  DCROperatorTypesComparotors,
} from "../../../applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";

export type DCRProps = { isDisabled: boolean };

interface FC<P> extends FunctionComponent<P> {
  (props: P, context?: any): ReactElement;
}

export type DCRElementProps = {
  conditions: any[];
  children?: (dcrProps: DCRProps) => ReactNode;
};

export const DCRElement: FC<DCRElementProps> = (props) => {
  const { conditions = [], children } = props;

  const form = Form.useFormInstance();
  const { dformSchema } = DformSchemaContext.useContext();

  const effects = { isDisabled: false, isHidden: false };

  conditions.forEach((condition) => {
    const { operatorType, effectType, fieldId, expectedValue } = condition;

    try {
      const field = dformSchema.getFieldById(fieldId);
      const convertor = DCRFieldValueConvertors[field.fieldType];
      const fieldValue = form.getFieldValue(fieldId) as DformFieldValueType;
      const operatorComparator = DCROperatorTypesComparotors[operatorType];

      const isApplicable = operatorComparator({
        type: field.fieldType,
        control: convertor(fieldValue),
        expected: DCRExpectedValueConvertor(expectedValue, field.fieldType),
      });

      if (isApplicable) {
        const effectKey = DCREffectProps[effectType];
        effects[effectKey] = isApplicable;
      }
    } catch (error) {
      devWarning(error);
    }
  });

  invariant(children, "Can not reach a children in the props.");

  if (effects.isHidden) {
    return null;
  }

  return children(effects);
};
