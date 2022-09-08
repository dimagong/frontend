import { FieldTypes } from "components/DForm";
import { DCRFieldControlValue } from "features/Applications/fieldConditionModel";

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
  NotEqual,
  Bigger,
  Smaller,
}

export type DCRUnaryOperatorTypes = DCROperatorTypes.Exist | DCROperatorTypes.NotExist;

export type DCRBinaryOperatorTypes =
  | DCROperatorTypes.Equal
  | DCROperatorTypes.NotEqual
  | DCROperatorTypes.Bigger
  | DCROperatorTypes.Smaller;

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
      case DCROperatorTypes.NotEqual:
        return "not equal";
      default:
        throw new Error(`Unexpected DCROperatorTypes ${this.type}`);
    }
  }

  get title(): string {
    switch (this.type) {
      case DCROperatorTypes.Equal:
      case DCROperatorTypes.NotEqual:
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
  [DCRSupportedFieldTypes.Text]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DCRSupportedFieldTypes.Date]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DCRSupportedFieldTypes.Select]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DCRSupportedFieldTypes.LongText]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DCRSupportedFieldTypes.TextArea]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DCRSupportedFieldTypes.Number]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DCRSupportedFieldTypes.Boolean]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DCRSupportedFieldTypes.File]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DCRSupportedFieldTypes.FileList]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DCRSupportedFieldTypes.MultiSelect]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
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
        case DCROperatorTypes.NotEqual:
        case DCROperatorTypes.Bigger:
        case DCROperatorTypes.Smaller:
          return new DCRBinaryOperator(operatorType);
        default:
          throw new Error(`There is no operator with type ${operatorType}`);
      }
    });
  }
}

interface ComparatorArgument {
  expected: string;
  control: DCRFieldControlValue | null;
  controlType: DCRSupportedFieldTypes;
}

const getISOStringAsDateTimestamp = (ISOString: string) => new Date(ISOString).valueOf();

export const DCROperatorTypesComparotors = {
  [DCROperatorTypes.Exist]: ({ control }: ComparatorArgument) => {
    if (control === null || control === undefined) return false;

    if (Array.isArray(control)) {
      return control.length > 0;
    }

    switch (typeof control) {
      case "string":
      case "number":
        return String(control) !== "";
      case "boolean":
        return control;
      default:
        throw new Error(`Unreachable: Do not support a control value type: ${typeof control}`);
    }
  },

  [DCROperatorTypes.NotExist]: ({ control }: ComparatorArgument) => {
    if (control === null || control === undefined) return true;

    if (Array.isArray(control)) {
      return control.length === 0;
    }

    switch (typeof control) {
      case "string":
      case "number":
        return String(control) === "";
      case "boolean":
        return !control;
      default:
        throw new Error(`Unreachable: Do not support a control value type: ${typeof control}`);
    }
  },

  [DCROperatorTypes.Equal]: ({ expected, control, controlType }: ComparatorArgument) => {
    if (control === null || control === undefined) return false;

    if (Array.isArray(control)) {
      // Currently, only string[] supports the Equal operator.
      return (control as string[]).includes(expected);
    }

    switch (typeof control) {
      case "string":
        return expected === control;
      case "number":
        if (controlType === DCRSupportedFieldTypes.Date) {
          return control === getISOStringAsDateTimestamp(expected);
        }
        return Number(expected) === control;
      default:
        throw new Error(`Unreachable: Do not support a control value type: ${typeof control}`);
    }
  },

  [DCROperatorTypes.NotEqual]: ({ expected, control, controlType }: ComparatorArgument) => {
    if (control === null || control === undefined) return true;

    if (Array.isArray(control)) {
      // Currently, only string[] supports the Equal operator.
      return !(control as string[]).includes(expected);
    }

    switch (typeof control) {
      case "string":
        return expected !== control;
      case "number":
        if (controlType === DCRSupportedFieldTypes.Date) {
          return control !== getISOStringAsDateTimestamp(expected);
        }
        return Number(expected) !== control;
      default:
        throw new Error(`Unreachable: Do not support a control value type: ${typeof control}`);
    }
  },

  [DCROperatorTypes.Bigger]: ({ expected, control, controlType }: ComparatorArgument) => {
    switch (typeof control) {
      case "number":
        if (controlType === DCRSupportedFieldTypes.Date) {
          return control > getISOStringAsDateTimestamp(expected);
        }
        return control > Number(expected);
      default:
        return false;
    }
  },

  [DCROperatorTypes.Smaller]: ({ expected, control, controlType }: ComparatorArgument) => {
    switch (typeof control) {
      case "number":
        if (controlType === DCRSupportedFieldTypes.Date) {
          return control < getISOStringAsDateTimestamp(expected);
        }
        return control < Number(expected);
      default:
        return false;
    }
  },
};

export const DCRFieldValueConvertors = {
  [DCRSupportedFieldTypes.Text]: ({ value }) => (value == null ? null : String(value)),
  [DCRSupportedFieldTypes.Date]: ({ value }) => (value == null ? null : new Date(value).valueOf()),
  [DCRSupportedFieldTypes.Select]: ({ value }) => (value == null ? null : String(value)),
  [DCRSupportedFieldTypes.LongText]: ({ value }) => (value == null ? null : String(value)),
  [DCRSupportedFieldTypes.TextArea]: ({ value }) => (value == null ? null : String(value)),
  [DCRSupportedFieldTypes.Number]: ({ value }) => (value == null ? null : Number(value)),
  [DCRSupportedFieldTypes.Boolean]: ({ value }) => (value == null ? null : Boolean(value)),
  [DCRSupportedFieldTypes.File]: ({ files }) => (Array.isArray(files) ? Array.from(files) : []),
  [DCRSupportedFieldTypes.FileList]: ({ files }) => (Array.isArray(files) ? Array.from(files) : []),
  [DCRSupportedFieldTypes.MultiSelect]: ({ value }) => (Array.isArray(value) ? Array.from(value) : []),
};
