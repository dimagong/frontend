import { FieldTypes } from "features/dform";

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

  constructor(readonly type: DCRUnaryOperatorTypes, readonly fieldType: FieldTypes) {}

  get name(): string {
    switch (this.type) {
      case DCROperatorTypes.Exist:
        switch (this.fieldType) {
          case FieldTypes.Select:
            return "Selected";
          case FieldTypes.Boolean:
            return "Checked";
          case FieldTypes.File:
            return "Uploaded";
          case FieldTypes.FileList:
            return "At least one uploaded";
          case FieldTypes.MultiSelect:
            return "At least one selected";
          default:
            return "filled";
        }
      case DCROperatorTypes.NotExist:
        switch (this.fieldType) {
          case FieldTypes.Select:
            return "Unselected";
          case FieldTypes.Boolean:
            return "Unchecked";
          case FieldTypes.File:
            return "Uploaded";
          case FieldTypes.FileList:
            return "No one uploaded";
          case FieldTypes.MultiSelect:
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
  [FieldTypes.Text]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [FieldTypes.Date]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [FieldTypes.Select]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [FieldTypes.LongText]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [FieldTypes.TextArea]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [FieldTypes.Number]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [FieldTypes.Boolean]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [FieldTypes.File]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [FieldTypes.FileList]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [FieldTypes.MultiSelect]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
};

export class DCRSupportedFieldOperatorsFactory {
  static build(fieldType: FieldTypes): DCROperator[] | null {
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

interface ComparatorArgument<T extends FieldTypes> {
  type: T;
  control:
    | (T extends FieldTypes.Boolean ? boolean : never)
    | (T extends FieldTypes.MultiSelect ? Array<string> : never)
    | (T extends FieldTypes.File | FieldTypes.FileList ? Array<object> : never)
    | (T extends FieldTypes.Date | FieldTypes.Number ? number : never)
    | (T extends FieldTypes.Text | FieldTypes.Select | FieldTypes.LongText | FieldTypes.TextArea ? string : never)
    | null;
  expected: (T extends FieldTypes.Date | FieldTypes.Number ? number : string) | null;
}

type TextComparatorArgument = ComparatorArgument<FieldTypes.Text>;
type SelectComparatorArgument = ComparatorArgument<FieldTypes.Select>;
type LongTextComparatorArgument = ComparatorArgument<FieldTypes.LongText>;
type TextAreaComparatorArgument = ComparatorArgument<FieldTypes.TextArea>;
type DateComparatorArgument = ComparatorArgument<FieldTypes.Date>;
type NumberComparatorArgument = ComparatorArgument<FieldTypes.Number>;
type FileComparatorArgument = ComparatorArgument<FieldTypes.File>;
type FileListComparatorArgument = ComparatorArgument<FieldTypes.FileList>;
type MultiSelectComparatorArgument = ComparatorArgument<FieldTypes.MultiSelect>;
type BooleanComparatorArgument = ComparatorArgument<FieldTypes.Boolean>;

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
      case FieldTypes.Boolean:
        return control === true;
      case FieldTypes.File:
      case FieldTypes.FileList:
      case FieldTypes.MultiSelect:
        return control.length > 0;
      case FieldTypes.Date:
      case FieldTypes.Number:
        return String(control).length > 0;
      case FieldTypes.Text:
      case FieldTypes.Select:
      case FieldTypes.TextArea:
      case FieldTypes.LongText:
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
      case FieldTypes.Boolean:
        return control === false;
      case FieldTypes.File:
      case FieldTypes.FileList:
      case FieldTypes.MultiSelect:
        return control.length === 0;
      case FieldTypes.Date:
      case FieldTypes.Number:
        return String(control).length === 0;
      case FieldTypes.Text:
      case FieldTypes.Select:
      case FieldTypes.TextArea:
      case FieldTypes.LongText:
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
      case FieldTypes.MultiSelect:
        return control.includes(expected);
      case FieldTypes.Date:
      case FieldTypes.Number:
        return control === expected;
      case FieldTypes.Text:
      case FieldTypes.Select:
      case FieldTypes.TextArea:
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
      case FieldTypes.MultiSelect:
        return !control.includes(expected);
      case FieldTypes.Date:
      case FieldTypes.Number:
        return control !== expected;
      case FieldTypes.Text:
      case FieldTypes.Select:
      case FieldTypes.TextArea:
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
      case FieldTypes.Date:
      case FieldTypes.Number:
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
      case FieldTypes.Date:
      case FieldTypes.Number:
        return control < expected;
      default:
        throw getOperatorError(type, "Smaller");
    }
  },
};

export const DCRFieldValueConvertors = {
  [FieldTypes.Text]: (value) => (value == null ? null : String(value)),

  [FieldTypes.Date]: (value) => (value == null ? null : new Date(value).valueOf()),

  [FieldTypes.Select]: (value) => (value == null ? null : String(value)),

  [FieldTypes.LongText]: (value) => (value == null ? null : String(value)),

  [FieldTypes.TextArea]: (value) => (value == null ? null : String(value)),

  [FieldTypes.Number]: (value) => (value == null ? null : Number(value)),

  [FieldTypes.Boolean]: (value) => (value == null ? null : Boolean(value)),

  [FieldTypes.File]: (files) => (Array.isArray(files) ? Array.from(files) : []),

  [FieldTypes.FileList]: (files) => (Array.isArray(files) ? Array.from(files) : []),

  [FieldTypes.MultiSelect]: (value) => (Array.isArray(value) ? Array.from(value) : []),
};

export const DCRExpectedValueConvertor = (value: string | null, fieldType: FieldTypes): string | number | null => {
  if (value == null) return null;

  switch (fieldType) {
    case FieldTypes.Date:
      return new Date(value).valueOf();
    case FieldTypes.Number:
      return Number(value);
    default:
      return String(value);
  }
};
