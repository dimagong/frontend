import { v4 } from "uuid";

import {
  DformFieldTypes,
  DformBlockTypes,
  DformElementTypes,
  DformBlockSizeTypes,
  DformDateFormatTypes,
  DformMultiSelectUIStyles,
  DformResourceCompileOptionTypes,
} from "features/dform/data/models";

import { AbstractDFormFieldConditionModel } from "./fieldConditionModel";

interface CommonFieldProperties<T extends DformFieldTypes | DformBlockTypes.HelpText> {
  id: string;
  type: T;
  title: string;
  groupId: string;
  classes: DformBlockSizeTypes;
  isRequired: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  isVisibleNonManagers: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId: string | number;
  conditions: AbstractDFormFieldConditionModel[];
}

interface StringFieldProperties<T extends DformFieldTypes> extends CommonFieldProperties<T> {
  minLength: number | null;
  maxLength: number | null;
}

interface DateFieldProperties extends CommonFieldProperties<DformFieldTypes.Date> {
  format: DformDateFormatTypes;
}

interface NumberFieldProperties extends CommonFieldProperties<DformFieldTypes.Number> {
  minimum: number | null;
  maximum: number | null;
}

interface SelectFieldProperties<T extends DformFieldTypes = DformFieldTypes.Select> extends CommonFieldProperties<T> {
  options: string[];
}

interface MultiSelectFieldProperties extends SelectFieldProperties<DformFieldTypes.MultiSelect> {
  uiStyle: DformMultiSelectUIStyles | null;
}

type TextFieldProperties = StringFieldProperties<DformFieldTypes.Text>;

type TextAreaFieldProperties = StringFieldProperties<DformFieldTypes.TextArea>;

type LongTextFieldProperties = StringFieldProperties<DformFieldTypes.LongText>;

type FileFieldProperties = CommonFieldProperties<DformFieldTypes.File>;

type BooleanFieldProperties = CommonFieldProperties<DformFieldTypes.Boolean>;

type FileListFieldProperties = CommonFieldProperties<DformFieldTypes.Boolean>;

interface ResourceFieldProperties extends CommonFieldProperties<DformFieldTypes.Resource> {
  resourceCompileOption: DformResourceCompileOptionTypes;
  resourceManagerFieldId: string;
}

interface HelpTextProperties extends CommonFieldProperties<DformBlockTypes.HelpText> {
  helpTextValue: string;
}

type FieldProperties =
  | TextFieldProperties
  | DateFieldProperties
  | FileFieldProperties
  | SelectFieldProperties
  | NumberFieldProperties
  | BooleanFieldProperties
  | LongTextFieldProperties
  | TextAreaFieldProperties
  | FileListFieldProperties
  | ResourceFieldProperties
  | HelpTextProperties
  | MultiSelectFieldProperties;

const deleteUndefinedKeys = <T>(instance: T): T => {
  Object.keys(instance).forEach((key) => {
    if (instance[key] === undefined) {
      delete instance[key];
    }
  });
  return instance as T;
};

export abstract class AbstractDFormFieldModel implements CommonFieldProperties<any> {
  /**
   * Indicates an element type.
   */
  readonly elementType: DformElementTypes = DformElementTypes.Block;
  /**
   * Indicates a unique identifier (ID) of an owning group.
   */
  groupId: string;
  /**
   * Indicates a field type.
   */
  type: DformFieldTypes | DformBlockTypes.HelpText = DformFieldTypes.Text;
  /**
   * Represents a caption for an item in a user interface.
   */
  title: string = "New Field";
  /**
   * Indicates that the user must specify a value for the field before the owning form can be submitted.
   */
  isRequired: boolean = false;
  /**
   * Makes a field not mutable, focusable or even submitted with a form.
   */
  isDisabled: boolean = false;
  /**
   * Indicates that the field is not relevant or not to users who are non-managers.
   */
  isProtected: boolean = false;
  /**
   * Indicates that the field is visible or not to users who are non-managers.
   */
  isVisibleNonManagers: boolean = false;
  /**
   * Indicates that a field title is shown/hidden.
   */
  isLabelShowing: boolean = true;
  /**
   * Indicates a unique identifier (ID) of a related master schema field.
   */
  masterSchemaFieldId: string | number;
  /**
   * A html class value that will be consumed by field wrapper.
   */
  classes: DformBlockSizeTypes = DformBlockSizeTypes.Full;
  /**
   * Field conditions.
   */
  conditions: AbstractDFormFieldConditionModel[] = [];
  /**
   * For field type strings like DFormFieldTypes.Text, DFormFieldTypes.TextArea, and DFormFieldTypes.LongText.
   */
  minLength: number | null;
  maxLength: number | null;
  /**
   * For field type DFormFieldTypes.Date
   */
  format: DformDateFormatTypes;
  /**
   * For field type DFormFieldTypes.Number
   */
  minimum: number | null;
  maximum: number | null;
  /**
   * For field type DFormFieldTypes.Select and DFormFieldTypes.MultiSelect
   */
  options: string[];
  /**
   * For field type DFormFieldTypes.MultiSelect
   */
  uiStyle: DformMultiSelectUIStyles | null;
  /**
   * For field type DFormFieldTypes.Resource
   */
  resourceCompileOption: DformResourceCompileOptionTypes;
  resourceManagerFieldId: string;
  /**
   * For field type DFormFieldTypes.HelpText
   */
  helpTextValue: string;

  constructor(readonly id: string) {}
}

export class DFormFieldModel extends AbstractDFormFieldModel {
  static create(groupId: string): DFormFieldModel {
    const id = v4();
    return deleteUndefinedKeys(new DFormFieldModel({ id, groupId }));
  }

  static from(data: { id: string } & Partial<FieldProperties>): DFormFieldModel {
    return deleteUndefinedKeys(new DFormFieldModel(data));
  }

  constructor(properties: { id: string } & Partial<FieldProperties>) {
    super(properties.id);

    this.type = properties.type ?? this.type;
    this.title = properties.title ?? this.title;
    this.groupId = properties.groupId ?? this.groupId;
    this.isRequired = properties.isRequired ?? this.isRequired;
    this.isDisabled = properties.isDisabled ?? this.isDisabled;
    this.isProtected = properties.isProtected ?? this.isProtected;
    this.isVisibleNonManagers = properties.isVisibleNonManagers ?? this.isVisibleNonManagers;
    this.isLabelShowing = properties.isLabelShowing ?? this.isLabelShowing;
    this.masterSchemaFieldId = properties.masterSchemaFieldId ?? this.masterSchemaFieldId;
    this.classes = properties.classes ?? this.classes;
    this.conditions = properties.conditions ?? this.conditions;

    switch (properties.type) {
      case DformFieldTypes.Text:
      case DformFieldTypes.TextArea:
      case DformFieldTypes.LongText:
        this.minLength = properties.minLength ?? this.minLength ?? null;
        this.maxLength = properties.maxLength ?? this.maxLength ?? null;
        break;
      case DformFieldTypes.Date:
        this.format = properties.format ?? this.format ?? DformDateFormatTypes.Date;
        break;
      case DformFieldTypes.Number:
        this.minimum = properties.minimum ?? this.minimum ?? null;
        this.maximum = properties.maximum ?? this.maximum ?? null;
        break;
      case DformFieldTypes.Select:
        this.options = properties.options ?? this.options ?? [];
        break;
      case DformFieldTypes.MultiSelect:
        this.options = properties.options ?? this.options ?? [];
        this.uiStyle = properties.uiStyle ?? this.uiStyle ?? null;
        break;
      case DformBlockTypes.HelpText:
        this.helpTextValue = properties.helpTextValue ?? this.helpTextValue ?? "New help text";
        break;
      case DformFieldTypes.Resource:
        this.resourceCompileOption =
          properties.resourceCompileOption ??
          this.resourceCompileOption ??
          DformResourceCompileOptionTypes.CompileOnOnboardingAssociation;
        this.resourceManagerFieldId = properties.resourceManagerFieldId ?? this.resourceManagerFieldId ?? null;
        break;
    }
  }
}
