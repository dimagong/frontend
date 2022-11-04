import { v4 } from "uuid";

import {
  DCREffectTypes,
  DCROperatorTypes,
} from "./Components/DFormElementEdit/Components/ConditionalElementRender/constants";

export interface DFormFieldConditionProperties {
  id: string;
  fieldId: string;
  effectType: DCREffectTypes;
  operatorType: DCROperatorTypes;
  expectedValue: string;
}

export abstract class AbstractDFormFieldConditionModel implements DFormFieldConditionProperties {
  /**
   * An id of a dependent field whose value is used for condition.
   */
  fieldId: string;
  /**
   * An effect type that applies if a condition is in an applicable state.
   */
  effectType: DCREffectTypes;
  /**
   * An operator type defines the way to check a value.
   */
  operatorType: DCROperatorTypes;
  /**
   * A value is used to compare with dependent field value.
   */
  expectedValue: string;

  constructor(readonly id: string) {}
}

export class DFormFieldConditionModel extends AbstractDFormFieldConditionModel {
  static create() {
    return new DFormFieldConditionModel({ id: v4() });
  }

  static from(data: { id: string } & Partial<DFormFieldConditionProperties>) {
    return new DFormFieldConditionModel(data);
  }

  constructor(properties: { id: string } & Partial<DFormFieldConditionProperties>) {
    super(properties.id);

    this.fieldId = properties.fieldId ?? this.fieldId;
    this.effectType = properties.effectType ?? this.effectType;
    this.operatorType = properties.operatorType ?? this.operatorType;
    this.expectedValue = properties.expectedValue ?? this.expectedValue;
  }
}
