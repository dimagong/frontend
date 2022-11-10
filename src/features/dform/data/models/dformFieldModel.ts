import type { DformBlockId, DformFieldValueType, DformGroupId } from "./types";
import { AbstractDformBlockModel, DformBlockSizeTypes, DformBlockTypes } from "./dformBlockModel";

export enum DformFieldTypes {
  Boolean = "boolean",
  Date = "date",
  File = "file",
  FileList = "fileList",
  LongText = "longText",
  MultiSelect = "multiSelect",
  Number = "number",
  Resource = "resource",
  Select = "select",
  Text = "text",
  TextArea = "textArea",
}

export abstract class AbstractDformFieldModel extends AbstractDformBlockModel {
  static fieldValidator(value: DformFieldValueType, isRequired: boolean): boolean {
    if (isRequired) {
      if (value === null) {
        return false;
      }
      if (value === undefined) {
        return false;
      }
      if (value === "") {
        return false;
      }
      if (Array.isArray(value)) {
        return value.length !== 0;
      }
    }
    return true;
  }

  readonly blockType = DformBlockTypes.Field;
  abstract readonly fieldType: DformFieldTypes;

  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    public label: string,
    public isRequired: boolean,
    public isLabelShowing: boolean,
    public masterSchemaFieldId: number
  ) {
    super(id, conditions, isProtected, groupId, blockSize);
  }

  isValid(value: DformFieldValueType): boolean {
    return AbstractDformFieldModel.fieldValidator(value, this.isRequired);
  }
}

export class DformBooleanFieldModel extends AbstractDformFieldModel {
  readonly fieldType = DformFieldTypes.Boolean;
}

export enum DformDateFormatTypes {
  Date = "date",
  Time = "date-time",
}

export class DformDateFieldModel extends AbstractDformFieldModel {
  readonly fieldType = DformFieldTypes.Date;

  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    label: string,
    isRequired: boolean,
    isLabelShowing: boolean,
    public format: DformDateFormatTypes,
    masterSchemaFieldId: number
  ) {
    super(id, groupId, blockSize, conditions, isProtected, label, isRequired, isLabelShowing, masterSchemaFieldId);
  }
}

export class DformFileFieldModel extends AbstractDformFieldModel {
  readonly fieldType = DformFieldTypes.File;
}

export class DformFileListFieldModel extends AbstractDformFieldModel {
  readonly fieldType = DformFieldTypes.FileList;
}

export abstract class DformTextValidationFieldModel extends AbstractDformFieldModel {
  static stringValidator(value: unknown, minLength: number | undefined, maxLength: number | undefined) {
    const valueAsString = String(value);

    if (Number.isNaN(valueAsString)) {
      return { isValid: false, message: "value must be string!" };
    }

    if (minLength !== undefined && maxLength !== undefined) {
      return valueAsString.length >= minLength && valueAsString.length <= maxLength
        ? { isValid: true }
        : { isValid: false, message: `value length must be between ${minLength} and ${maxLength}!` };
    }
    if (minLength !== undefined) {
      return valueAsString.length >= minLength
        ? { isValid: true }
        : { isValid: false, message: `value must be at least ${minLength}!` };
    }
    if (maxLength !== undefined) {
      return valueAsString.length <= maxLength
        ? { isValid: true }
        : { isValid: false, message: `value cannot be longer than ${maxLength}!` };
    }

    return { isValid: true };
  }

  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    label: string,
    isRequired: boolean,
    isLabelShowing: boolean,
    public minLength: number | undefined,
    public maxLength: number | undefined,
    masterSchemaFieldId: number
  ) {
    super(id, groupId, blockSize, conditions, isProtected, label, isRequired, isLabelShowing, masterSchemaFieldId);
  }

  isValid(value: DformFieldValueType): boolean {
    return (
      DformTextValidationFieldModel.stringValidator(value, this.minLength, this.maxLength).isValid &&
      AbstractDformFieldModel.fieldValidator(value, this.isRequired)
    );
  }
}

export class DformLongTextFieldModel extends DformTextValidationFieldModel {
  readonly fieldType = DformFieldTypes.LongText;
}

abstract class DformOptionsFieldModel extends AbstractDformFieldModel {
  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    label: string,
    isRequired: boolean,
    isLabelShowing: boolean,
    public options: string[],
    masterSchemaFieldId: number
  ) {
    super(id, groupId, blockSize, conditions, isProtected, label, isRequired, isLabelShowing, masterSchemaFieldId);
  }
}

export enum DformMultiSelectUIStyles {
  None = "none",
  Checkboxes = "checkboxes",
}

export class DformMultiSelectFieldModel extends DformOptionsFieldModel {
  readonly fieldType = DformFieldTypes.MultiSelect;

  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    label: string,
    isRequired: boolean,
    isLabelShowing: boolean,
    public uiStyle: DformMultiSelectUIStyles,
    options: string[],
    masterSchemaFieldId: number
  ) {
    super(
      id,
      groupId,
      blockSize,
      conditions,
      isProtected,
      label,
      isRequired,
      isLabelShowing,
      options,
      masterSchemaFieldId
    );
  }
}

export class DformNumberFieldModel extends AbstractDformFieldModel {
  static numberValidator(value: unknown, minimum: number | undefined, maximum: number | undefined) {
    const valueAsNumber = Number(value);

    if (Number.isNaN(valueAsNumber)) {
      return { isValid: false, message: "value must be numeric!" };
    }

    if (minimum !== undefined && maximum !== undefined) {
      return valueAsNumber >= minimum && valueAsNumber <= maximum
        ? { isValid: true }
        : { isValid: false, message: `value must be between ${minimum} and ${maximum}!` };
    }
    if (minimum !== undefined) {
      return valueAsNumber >= minimum
        ? { isValid: true }
        : { isValid: false, message: `value must be at least ${minimum}!` };
    }
    if (maximum !== undefined) {
      return valueAsNumber <= maximum
        ? { isValid: true }
        : { isValid: false, message: `value cannot be longer than ${maximum}!` };
    }

    return { isValid: true };
  }

  readonly fieldType = DformFieldTypes.Number;

  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    label: string,
    isRequired: boolean,
    isLabelShowing: boolean,
    public minimum: number | undefined,
    public maximum: number | undefined,
    masterSchemaFieldId: number
  ) {
    super(id, groupId, blockSize, conditions, isProtected, label, isRequired, isLabelShowing, masterSchemaFieldId);
  }

  isValid(value: DformFieldValueType): boolean {
    return (
      DformNumberFieldModel.numberValidator(value, this.minimum, this.maximum).isValid &&
      AbstractDformFieldModel.fieldValidator(value, this.isRequired)
    );
  }
}

export enum DformResourceCompileOptionTypes {
  None,
  CompileOnOnboardingAssociation,
}

export class DformResourceFieldModel extends AbstractDformFieldModel {
  readonly fieldType = DformFieldTypes.Resource;

  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    label: string,
    isRequired: boolean,
    isLabelShowing: boolean,
    public resourceCompileOption: DformResourceCompileOptionTypes,
    public resourceManagerFieldId: number,
    masterSchemaFieldId: number
  ) {
    super(id, groupId, blockSize, conditions, isProtected, label, isRequired, isLabelShowing, masterSchemaFieldId);
  }
}

export class DformSelectFieldModel extends DformOptionsFieldModel {
  readonly fieldType = DformFieldTypes.Select;
}

export class DformTextFieldModel extends DformTextValidationFieldModel {
  readonly fieldType = DformFieldTypes.Text;
}

export class DformTextAreaFieldModel extends DformTextValidationFieldModel {
  readonly fieldType = DformFieldTypes.TextArea;
}

export type DformFieldModel =
  | DformBooleanFieldModel
  | DformDateFieldModel
  | DformFileFieldModel
  | DformFileListFieldModel
  | DformLongTextFieldModel
  | DformMultiSelectFieldModel
  | DformNumberFieldModel
  | DformResourceFieldModel
  | DformSelectFieldModel
  | DformTextFieldModel
  | DformTextAreaFieldModel;
