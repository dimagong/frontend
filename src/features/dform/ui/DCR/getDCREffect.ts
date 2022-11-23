import { devWarning } from "features/common";

import { DformBlockId, DformFieldModel, DformFieldValueType } from "../../data/models";

import {
  DCREffectProps,
  DCRExpectedValueConvertor,
  DCRFieldValueConvertors,
  DCROperatorTypesComparotors,
} from "features/applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";

export type DCREffect = { isHidden: boolean; isDisabled: boolean };

type Spec = {
  conditions: any[];
  getFieldById: (fieldId: DformBlockId) => DformFieldModel;
  getFieldValue: (fieldId: DformBlockId) => DformFieldValueType;
};

export const getDCREffect = (spec: Spec): DCREffect => {
  const { conditions, getFieldById, getFieldValue } = spec;
  const effects = { isDisabled: false, isHidden: false };

  conditions.forEach((condition) => {
    const { operatorType, effectType, fieldId, expectedValue } = condition;

    try {
      const field = getFieldById(fieldId);
      const convertor = DCRFieldValueConvertors[field.fieldType];
      const fieldValue = getFieldValue(fieldId);
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

  return effects;
};
