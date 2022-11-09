import { DformFieldTypes } from "features/dform/data/models";

export enum DCRSupportedFieldTypes {
  Text = DformFieldTypes.Text,
  Date = DformFieldTypes.Date,
  File = DformFieldTypes.File,
  Select = DformFieldTypes.Select,
  Number = DformFieldTypes.Number,
  Boolean = DformFieldTypes.Boolean,
  LongText = DformFieldTypes.LongText,
  TextArea = DformFieldTypes.TextArea,
  FileList = DformFieldTypes.FileList,
  MultiSelect = DformFieldTypes.MultiSelect,
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

  constructor(readonly type: DCRUnaryOperatorTypes, readonly fieldType: DformFieldTypes) {}

  get name(): string {
    switch (this.type) {
      case DCROperatorTypes.Exist:
        switch (this.fieldType) {
          case DformFieldTypes.Select:
            return "Selected";
          case DformFieldTypes.Boolean:
            return "Checked";
          case DformFieldTypes.File:
            return "Uploaded";
          case DformFieldTypes.FileList:
            return "At least one uploaded";
          case DformFieldTypes.MultiSelect:
            return "At least one selected";
          default:
            return "filled";
        }
      case DCROperatorTypes.NotExist:
        switch (this.fieldType) {
          case DformFieldTypes.Select:
            return "Unselected";
          case DformFieldTypes.Boolean:
            return "Unchecked";
          case DformFieldTypes.File:
            return "Uploaded";
          case DformFieldTypes.FileList:
            return "No one uploaded";
          case DformFieldTypes.MultiSelect:
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
  [DformFieldTypes.Text]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DformFieldTypes.Date]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DformFieldTypes.Select]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DformFieldTypes.LongText]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DformFieldTypes.TextArea]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
  [DformFieldTypes.Number]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [DformFieldTypes.Boolean]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DformFieldTypes.File]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DformFieldTypes.FileList]: [DCROperatorTypes.Exist, DCROperatorTypes.NotExist],
  [DformFieldTypes.MultiSelect]: [
    DCROperatorTypes.Exist,
    DCROperatorTypes.NotExist,
    DCROperatorTypes.Equal,
    DCROperatorTypes.NotEqual,
  ],
};

export class DCRSupportedFieldOperatorsFactory {
  static build(fieldType: DformFieldTypes): DCROperator[] | null {
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

interface ComparatorArgument<T extends DformFieldTypes> {
  type: T;
  control:
    | (T extends DformFieldTypes.Boolean ? boolean : never)
    | (T extends DformFieldTypes.MultiSelect ? Array<string> : never)
    | (T extends DformFieldTypes.File | DformFieldTypes.FileList ? Array<object> : never)
    | (T extends DformFieldTypes.Date | DformFieldTypes.Number ? number : never)
    | (T extends DformFieldTypes.Text | DformFieldTypes.Select | DformFieldTypes.LongText | DformFieldTypes.TextArea
        ? string
        : never)
    | null;
  expected: (T extends DformFieldTypes.Date | DformFieldTypes.Number ? number : string) | null;
}

type TextComparatorArgument = ComparatorArgument<DformFieldTypes.Text>;
type SelectComparatorArgument = ComparatorArgument<DformFieldTypes.Select>;
type LongTextComparatorArgument = ComparatorArgument<DformFieldTypes.LongText>;
type TextAreaComparatorArgument = ComparatorArgument<DformFieldTypes.TextArea>;
type DateComparatorArgument = ComparatorArgument<DformFieldTypes.Date>;
type NumberComparatorArgument = ComparatorArgument<DformFieldTypes.Number>;
type FileComparatorArgument = ComparatorArgument<DformFieldTypes.File>;
type FileListComparatorArgument = ComparatorArgument<DformFieldTypes.FileList>;
type MultiSelectComparatorArgument = ComparatorArgument<DformFieldTypes.MultiSelect>;
type BooleanComparatorArgument = ComparatorArgument<DformFieldTypes.Boolean>;

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
      case DformFieldTypes.Boolean:
        return control === true;
      case DformFieldTypes.File:
      case DformFieldTypes.FileList:
      case DformFieldTypes.MultiSelect:
        return control.length > 0;
      case DformFieldTypes.Date:
      case DformFieldTypes.Number:
        return String(control).length > 0;
      case DformFieldTypes.Text:
      case DformFieldTypes.Select:
      case DformFieldTypes.TextArea:
      case DformFieldTypes.LongText:
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
      case DformFieldTypes.Boolean:
        return control === false;
      case DformFieldTypes.File:
      case DformFieldTypes.FileList:
      case DformFieldTypes.MultiSelect:
        return control.length === 0;
      case DformFieldTypes.Date:
      case DformFieldTypes.Number:
        return String(control).length === 0;
      case DformFieldTypes.Text:
      case DformFieldTypes.Select:
      case DformFieldTypes.TextArea:
      case DformFieldTypes.LongText:
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
      case DformFieldTypes.MultiSelect:
        return control.includes(expected);
      case DformFieldTypes.Date:
      case DformFieldTypes.Number:
        return control === expected;
      case DformFieldTypes.Text:
      case DformFieldTypes.Select:
      case DformFieldTypes.TextArea:
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
      case DformFieldTypes.MultiSelect:
        return !control.includes(expected);
      case DformFieldTypes.Date:
      case DformFieldTypes.Number:
        return control !== expected;
      case DformFieldTypes.Text:
      case DformFieldTypes.Select:
      case DformFieldTypes.TextArea:
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
      case DformFieldTypes.Date:
      case DformFieldTypes.Number:
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
      case DformFieldTypes.Date:
      case DformFieldTypes.Number:
        return control < expected;
      default:
        throw getOperatorError(type, "Smaller");
    }
  },
};

export const DCRFieldValueConvertors = {
  [DformFieldTypes.Text]: (value) => (value == null ? null : String(value)),

  [DformFieldTypes.Date]: (value) => (value == null ? null : new Date(value).valueOf()),

  [DformFieldTypes.Select]: (value) => (value == null ? null : String(value)),

  [DformFieldTypes.LongText]: (value) => (value == null ? null : String(value)),

  [DformFieldTypes.TextArea]: (value) => (value == null ? null : String(value)),

  [DformFieldTypes.Number]: (value) => (value == null ? null : Number(value)),

  [DformFieldTypes.Boolean]: (value) => (value == null ? null : Boolean(value)),

  [DformFieldTypes.File]: (files) => (Array.isArray(files) ? Array.from(files) : []),

  [DformFieldTypes.FileList]: (files) => (Array.isArray(files) ? Array.from(files) : []),

  [DformFieldTypes.MultiSelect]: (value) => (Array.isArray(value) ? Array.from(value) : []),
};

export const DCRExpectedValueConvertor = (value: string | null, fieldType: DformFieldTypes): string | number | null => {
  if (value == null) return null;

  switch (fieldType) {
    case DformFieldTypes.Date:
      return new Date(value).valueOf();
    case DformFieldTypes.Number:
      return Number(value);
    default:
      return String(value);
  }
};
