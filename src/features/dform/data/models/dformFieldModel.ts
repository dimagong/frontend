import type { DformBlockId, DformGroupId } from "./types";
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
    public masterSchemaFieldId?: number
  ) {
    super(id, conditions, isProtected, groupId, blockSize);
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
    masterSchemaFieldId?: number
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

abstract class DformTextValidationFieldModel extends AbstractDformFieldModel {
  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    label: string,
    isRequired: boolean,
    isLabelShowing: boolean,
    public minLength: number | null,
    public maxLength: number | null,
    masterSchemaFieldId?: number
  ) {
    super(id, groupId, blockSize, conditions, isProtected, label, isRequired, isLabelShowing, masterSchemaFieldId);
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
    masterSchemaFieldId?: number
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
    masterSchemaFieldId?: number
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
    public minimum: number | null,
    public maximum: number | null,
    masterSchemaFieldId?: number
  ) {
    super(id, groupId, blockSize, conditions, isProtected, label, isRequired, isLabelShowing, masterSchemaFieldId);
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
    masterSchemaFieldId?: number
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
