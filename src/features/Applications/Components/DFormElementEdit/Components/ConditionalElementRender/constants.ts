import { FieldTypes } from "components/DForm/constants";

export enum DCRSupportedFieldTypes {
  Text = FieldTypes.Text,
  Date = FieldTypes.Date,
  File = FieldTypes.File,
  Select = FieldTypes.Select,
  Number = FieldTypes.Number,
  Boolean = FieldTypes.Boolean,
  LongText = FieldTypes.LongText,
  TextArea = FieldTypes.TextArea,
  FileList = FieldTypes.FileList,
  MultiSelect = FieldTypes.MultiSelect,
}

// DCR Effects

export enum DCREffectTypes {
  None,
  Visibility,
  Availability,
}

export const DCREffectProps = {
  [DCREffectTypes.Visibility]: "isHidden",
  [DCREffectTypes.Availability]: "isDisabled",
};

export const DCREffectLabels = {
  [DCREffectTypes.Visibility]: "visibility",
  [DCREffectTypes.Availability]: "availability",
};

// DCR Operators

export enum DCROperatorTypes {
  Exist,
  NotExist,
  Equal,
  Bigger,
  Smaller,
}

export type DCRUnaryOperatorTypes = DCROperatorTypes.Exist | DCROperatorTypes.NotExist;

export type DCRBinaryOperatorTypes = DCROperatorTypes.Equal | DCROperatorTypes.Bigger | DCROperatorTypes.Smaller;

export abstract class DCROperator {
  abstract type: DCROperatorTypes;
  abstract name: string;
  abstract title: string;
  abstract isUnary: boolean;
  abstract isBinary: boolean;
}

export class DCRUnaryOperator implements DCROperator {
  readonly isUnary = true;
  readonly isBinary = false;

  constructor(readonly type: DCRUnaryOperatorTypes, readonly fieldType: DCRSupportedFieldTypes) {}

  get name(): string {
    switch (this.type) {
      case DCROperatorTypes.Exist:
        switch (this.fieldType) {
          case DCRSupportedFieldTypes.Select:
            return "Selected";
          case DCRSupportedFieldTypes.Boolean:
            return "Checked";
          case DCRSupportedFieldTypes.File:
            return "Uploaded";
          case DCRSupportedFieldTypes.FileList:
            return "At least one uploaded";
          case DCRSupportedFieldTypes.MultiSelect:
            return "At least one selected";
          default:
            return "filled";
        }
      case DCROperatorTypes.NotExist:
        switch (this.fieldType) {
          case DCRSupportedFieldTypes.Select:
            return "Unselected";
          case DCRSupportedFieldTypes.Boolean:
            return "Unchecked";
          case DCRSupportedFieldTypes.File:
            return "Uploaded";
          case DCRSupportedFieldTypes.FileList:
            return "No one uploaded";
          case DCRSupportedFieldTypes.MultiSelect:
            return "No one selected";
          default:
            return "unfilled";
        }
      default:
        throw new Error(`Unexpected DCRUnaryOperatorType: ${this.type}`);
    }
  }

  get title(): string {
    switch (this.fieldType) {
      default:
        return "Will be";
    }
  }
}

export class DCRBinaryOperator implements DCROperator {
  readonly isUnary = false;
  readonly isBinary = true;

  constructor(readonly type: DCRBinaryOperatorTypes) {}

  get name(): string {
    switch (this.type) {
      case DCROperatorTypes.Bigger:
        return "bigger";
      case DCROperatorTypes.Smaller:
        return "smaller";
      case DCROperatorTypes.Equal:
        return "equal";
      default:
        throw new Error(`Unexpected DCROperatorTypes ${this.type}`);
    }
  }

  get title(): string {
    switch (this.type) {
      case DCROperatorTypes.Equal:
      case DCROperatorTypes.Bigger:
      case DCROperatorTypes.Smaller:
      default:
        return "Will be";
    }
  }

  get expectedValueTitle(): string {
    switch (this.type) {
      case DCROperatorTypes.Bigger:
      case DCROperatorTypes.Smaller:
        return "Then";
      case DCROperatorTypes.Equal:
      default:
        return "To";
    }
  }
}

export const DCRSupportedOperatorsByFieldTypes = {
  [DCRSupportedFieldTypes.Text]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist, DCROperatorTypes.Equal],
  [DCRSupportedFieldTypes.Date]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DCRSupportedFieldTypes.Select]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist, DCROperatorTypes.Equal],
  [DCRSupportedFieldTypes.LongText]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist, DCROperatorTypes.Equal],
  [DCRSupportedFieldTypes.TextArea]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist, DCROperatorTypes.Equal],
  [DCRSupportedFieldTypes.Number]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DCRSupportedFieldTypes.Boolean]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DCRSupportedFieldTypes.File]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DCRSupportedFieldTypes.FileList]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
};

export class DCRSupportedFieldOperatorsFactory {
  static build(fieldType: DCRSupportedFieldTypes): DCROperator[] | null {
    const supportedOperatorTypes: DCROperatorTypes[] = DCRSupportedOperatorsByFieldTypes[fieldType];

    if (!supportedOperatorTypes) return null;

    return supportedOperatorTypes.map((operatorType) => {
      switch (operatorType) {
        case DCROperatorTypes.Exist:
        case DCROperatorTypes.NotExist:
          return new DCRUnaryOperator(operatorType, fieldType);
        case DCROperatorTypes.Equal:
        case DCROperatorTypes.Bigger:
        case DCROperatorTypes.Smaller:
          return new DCRBinaryOperator(operatorType);
        default:
          throw new Error(`There is no operator with type ${operatorType}`);
      }
    });
  }
}

export const DCROperatorTypesComparotors = {
  [DCROperatorTypes.Exist]: (expectedValue, controlValue) => {
    return controlValue !== "" && controlValue !== null && controlValue !== undefined;
  },
  [DCROperatorTypes.NotExist]: (expectedValue, controlValue) => {
    return controlValue === "" || controlValue == null;
  },
  [DCROperatorTypes.Equal]: (expectedValue, controlValue) => {
    return expectedValue === controlValue;
  },
  [DCROperatorTypes.Bigger]: (expectedValue, controlValue) => {
    return controlValue > expectedValue;
  },
  [DCROperatorTypes.Smaller]: (expectedValue, controlValue) => {
    return controlValue < expectedValue;
  },
};

export const DCRFieldValueConvertors = {
  [DCRSupportedFieldTypes.Text]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [DCRSupportedFieldTypes.Date]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [DCRSupportedFieldTypes.Select]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [DCRSupportedFieldTypes.LongText]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [DCRSupportedFieldTypes.TextArea]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [DCRSupportedFieldTypes.Number]: ({ value }) => (typeof value === "number" ? Number(value) : null),
  [DCRSupportedFieldTypes.Boolean]: ({ value }) => (typeof value === "boolean" ? Boolean(value) : null),
  [DCRSupportedFieldTypes.File]: ({ files }) => (Array.isArray(files) ? Array.from(files) : []),
  [DCRSupportedFieldTypes.FileList]: ({ files }) => (Array.isArray(files) ? Array.from(files) : []),
  [DCRSupportedFieldTypes.MultiSelect]: ({ value }) => (Array.isArray(value) ? Array.from(value) : []),
};
