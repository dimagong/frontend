import { DFormFieldTypes } from "features/dform/types";

export enum DCRSupportedFieldTypes {
  Text = DFormFieldTypes.Text,
  Date = DFormFieldTypes.Date,
  File = DFormFieldTypes.File,
  Select = DFormFieldTypes.Select,
  Number = DFormFieldTypes.Number,
  Boolean = DFormFieldTypes.Boolean,
  LongText = DFormFieldTypes.LongText,
  TextArea = DFormFieldTypes.TextArea,
  FileList = DFormFieldTypes.FileList,
  MultiSelect = DFormFieldTypes.MultiSelect,
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

  constructor(readonly type: DCRUnaryOperatorTypes, readonly fieldType: DFormFieldTypes) {}

  get name(): string {
    switch (this.type) {
      case DCROperatorTypes.Exist:
        switch (this.fieldType) {
          case DFormFieldTypes.Select:
            return "Selected";
          case DFormFieldTypes.Boolean:
            return "Checked";
          case DFormFieldTypes.File:
            return "Uploaded";
          case DFormFieldTypes.FileList:
            return "At least one uploaded";
          case DFormFieldTypes.MultiSelect:
            return "At least one selected";
          default:
            return "filled";
        }
      case DCROperatorTypes.NotExist:
        switch (this.fieldType) {
          case DFormFieldTypes.Select:
            return "Unselected";
          case DFormFieldTypes.Boolean:
            return "Unchecked";
          case DFormFieldTypes.File:
            return "Uploaded";
          case DFormFieldTypes.FileList:
            return "No one uploaded";
          case DFormFieldTypes.MultiSelect:
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
  [DFormFieldTypes.Text]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DFormFieldTypes.Date]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DFormFieldTypes.Select]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DFormFieldTypes.LongText]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DFormFieldTypes.TextArea]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DFormFieldTypes.Number]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DFormFieldTypes.Boolean]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DFormFieldTypes.File]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DFormFieldTypes.FileList]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DFormFieldTypes.MultiSelect]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
};

export class DCRSupportedFieldOperatorsFactory {
  static build(fieldType: DFormFieldTypes): DCROperator[] | null {
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

interface ComparatorArgument<T extends DFormFieldTypes> {
  type: T;
  control:
    | (T extends DFormFieldTypes.Boolean ? boolean : never)
    | (T extends DFormFieldTypes.MultiSelect ? Array<string> : never)
    | (T extends DFormFieldTypes.File | DFormFieldTypes.FileList ? Array<object> : never)
    | (T extends DFormFieldTypes.Date | DFormFieldTypes.Number ? number : never)
    | (T extends DFormFieldTypes.Text | DFormFieldTypes.Select | DFormFieldTypes.LongText | DFormFieldTypes.TextArea
        ? string
        : never)
    | null;
  expected: (T extends DFormFieldTypes.Date | DFormFieldTypes.Number ? number : string) | null;
}

type TextComparatorArgument = ComparatorArgument<DFormFieldTypes.Text>;
type SelectComparatorArgument = ComparatorArgument<DFormFieldTypes.Select>;
type LongTextComparatorArgument = ComparatorArgument<DFormFieldTypes.LongText>;
type TextAreaComparatorArgument = ComparatorArgument<DFormFieldTypes.TextArea>;
type DateComparatorArgument = ComparatorArgument<DFormFieldTypes.Date>;
type NumberComparatorArgument = ComparatorArgument<DFormFieldTypes.Number>;
type FileComparatorArgument = ComparatorArgument<DFormFieldTypes.File>;
type FileListComparatorArgument = ComparatorArgument<DFormFieldTypes.FileList>;
type MultiSelectComparatorArgument = ComparatorArgument<DFormFieldTypes.MultiSelect>;
type BooleanComparatorArgument = ComparatorArgument<DFormFieldTypes.Boolean>;

type ExistenceComparatorArgument =
  | TextComparatorArgument
  | DateComparatorArgument
  | SelectComparatorArgument
  | LongTextComparatorArgument
  | TextAreaComparatorArgument
  | NumberComparatorArgument
  | FileComparatorArgument
  | FileListComparatorArgument
  | MultiSelectComparatorArgument
  | BooleanComparatorArgument;

type EqualityComparatorArgument =
  | TextComparatorArgument
  | DateComparatorArgument
  | SelectComparatorArgument
  | TextAreaComparatorArgument
  | NumberComparatorArgument
  | MultiSelectComparatorArgument;

type MeasureComparatorArgument = DateComparatorArgument | NumberComparatorArgument;

const getOperatorError = (type, operator) => new Error(`Unexpected field type: "${type}" for ${operator} operator.`);

export const DCROperatorTypesComparotors = {
  [DCROperatorTypes.Exist]: ({ type, control }: ExistenceComparatorArgument) => {
    if (control == null) {
      return false;
    }

    switch (type) {
      case DFormFieldTypes.Boolean:
        return control === true;
      case DFormFieldTypes.File:
      case DFormFieldTypes.FileList:
      case DFormFieldTypes.MultiSelect:
        return control.length > 0;
      case DFormFieldTypes.Date:
      case DFormFieldTypes.Number:
        return String(control).length > 0;
      case DFormFieldTypes.Text:
      case DFormFieldTypes.Select:
      case DFormFieldTypes.TextArea:
      case DFormFieldTypes.LongText:
        return control.length > 0;
      default:
        throw getOperatorError(type, "Exist");
    }
  },

  [DCROperatorTypes.NotExist]: ({ type, control }: ExistenceComparatorArgument) => {
    if (control == null) {
      return true;
    }

    switch (type) {
      case DFormFieldTypes.Boolean:
        return control === false;
      case DFormFieldTypes.File:
      case DFormFieldTypes.FileList:
      case DFormFieldTypes.MultiSelect:
        return control.length === 0;
      case DFormFieldTypes.Date:
      case DFormFieldTypes.Number:
        return String(control).length === 0;
      case DFormFieldTypes.Text:
      case DFormFieldTypes.Select:
      case DFormFieldTypes.TextArea:
      case DFormFieldTypes.LongText:
        return control.length === 0;
      default:
        throw getOperatorError(type, "NotExist");
    }
  },

  [DCROperatorTypes.Equal]: ({ type, control, expected }: EqualityComparatorArgument) => {
    if (control == null || expected == null) {
      return false;
    }

    switch (type) {
      case DFormFieldTypes.MultiSelect:
        return control.includes(expected);
      case DFormFieldTypes.Date:
      case DFormFieldTypes.Number:
        return control === expected;
      case DFormFieldTypes.Text:
      case DFormFieldTypes.Select:
      case DFormFieldTypes.TextArea:
        return control === expected;
      default:
        throw getOperatorError(type, "Equal");
    }
  },

  [DCROperatorTypes.NotEqual]: ({ type, control, expected }: EqualityComparatorArgument) => {
    if (control == null || expected == null) {
      return true;
    }

    switch (type) {
      case DFormFieldTypes.MultiSelect:
        return !control.includes(expected);
      case DFormFieldTypes.Date:
      case DFormFieldTypes.Number:
        return control !== expected;
      case DFormFieldTypes.Text:
      case DFormFieldTypes.Select:
      case DFormFieldTypes.TextArea:
        return control !== expected;
      default:
        throw getOperatorError(type, "NotEqual");
    }
  },

  [DCROperatorTypes.Bigger]: ({ type, control, expected }: MeasureComparatorArgument) => {
    if (control == null || expected == null) {
      return false;
    }

    switch (type) {
      case DFormFieldTypes.Date:
      case DFormFieldTypes.Number:
        return control > expected;
      default:
        throw getOperatorError(type, "Bigger");
    }
  },

  [DCROperatorTypes.Smaller]: ({ type, control, expected }: MeasureComparatorArgument) => {
    if (control == null || expected == null) {
      return false;
    }

    switch (type) {
      case DFormFieldTypes.Date:
      case DFormFieldTypes.Number:
        return control < expected;
      default:
        throw getOperatorError(type, "Smaller");
    }
  },
};

export const DCRFieldValueConvertors = {
  [DFormFieldTypes.Text]: (value) => (value == null ? null : String(value)),

  [DFormFieldTypes.Date]: (value) => (value == null ? null : new Date(value).valueOf()),

  [DFormFieldTypes.Select]: (value) => (value == null ? null : String(value)),

  [DFormFieldTypes.LongText]: (value) => (value == null ? null : String(value)),

  [DFormFieldTypes.TextArea]: (value) => (value == null ? null : String(value)),

  [DFormFieldTypes.Number]: (value) => (value == null ? null : Number(value)),

  [DFormFieldTypes.Boolean]: (value) => (value == null ? null : Boolean(value)),

  [DFormFieldTypes.File]: (files) => (Array.isArray(files) ? Array.from(files) : []),

  [DFormFieldTypes.FileList]: (files) => (Array.isArray(files) ? Array.from(files) : []),

  [DFormFieldTypes.MultiSelect]: (value) => (Array.isArray(value) ? Array.from(value) : []),
};

export const DCRExpectedValueConvertor = (value: string | null, fieldType: DFormFieldTypes): string | number | null => {
  if (value == null) return null;

  switch (fieldType) {
    case DFormFieldTypes.Date:
      return new Date(value).valueOf();
    case DFormFieldTypes.Number:
      return Number(value);
    default:
      return String(value);
  }
};
