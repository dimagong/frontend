import {
  DCREffectProps,
  DCREffectTypes,
  DCRExpectedValueConvertor,
  DCRFieldValueConvertors,
  DCROperatorTypes,
  DCROperatorTypesComparotors,
} from "features/applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";

import type { NormalizedDFormValues } from "../types";

type DFormElements = Record<string, any>;

type DFormCondition = {
  fieldId: string;
  effectType: DCREffectTypes;
  operatorType: DCROperatorTypes;
  expectedValue: string | null;
};

type DFormConditions = Array<DFormCondition>;

export const checkConditions = (
  elements: DFormElements,
  values: NormalizedDFormValues,
  fields: DFormElements
): DFormElements => {
  for (const elementId in elements) {
    if (!Object.hasOwnProperty.call(elements, elementId)) continue;
    const element = elements[elementId];
    const conditions: DFormConditions = element.conditions;

    for (const condition of conditions) {
      const { operatorType, effectType, fieldId, expectedValue } = condition;

      const field = fields[fieldId];
      const convertor = DCRFieldValueConvertors[field.type];
      const controlValue = values[field.masterSchemaFieldId];
      const operatorComparator = DCROperatorTypesComparotors[operatorType];

      const isApplicable = operatorComparator({
        type: field.type,
        control: convertor(controlValue),
        expected: DCRExpectedValueConvertor(expectedValue, field.type) as any,
      });

      if (isApplicable) {
        const propName = DCREffectProps[effectType];
        elements[elementId][propName] = isApplicable;
      }
    }
  }

  return elements;
};
