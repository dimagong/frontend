import { v4 } from "uuid";

import {
  DFormFieldTypes,
  DFormBlockTypes,
  DFormElementTypes,
  DFormBlockSizeTypes,
  DFormDateFormatTypes,
  DFormMultiSelectUIStyles,
} from "features/dform/types";

import { ResourceCompileOptionTypes } from "./constants";
import { AbstractDFormFieldConditionModel } from "./fieldConditionModel";

interface CommonFieldProperties<T extends DFormFieldTypes | DFormBlockTypes.HelpText> {
  id: string;
  type: T;
  title: string;
  groupId: string;
  classes: DFormBlockSizeTypes;
  isRequired: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId: string | number;
  conditions: AbstractDFormFieldConditionModel[];
}

interface StringFieldProperties<T extends DFormFieldTypes> extends CommonFieldProperties<T> {
  minLength: number | null;
  maxLength: number | null;
}

interface DateFieldProperties extends CommonFieldProperties<DFormFieldTypes.Date> {
  format: DFormDateFormatTypes;
}

interface NumberFieldProperties extends CommonFieldProperties<DFormFieldTypes.Number> {
  minimum: number | null;
  maximum: number | null;
}

interface SelectFieldProperties<T extends DFormFieldTypes = DFormFieldTypes.Select> extends CommonFieldProperties<T> {
  options: string[];
}

interface MultiSelectFieldProperties extends SelectFieldProperties<DFormFieldTypes.MultiSelect> {
  uiStyle: DFormMultiSelectUIStyles | null;
}

type TextFieldProperties = StringFieldProperties<DFormFieldTypes.Text>;

type TextAreaFieldProperties = StringFieldProperties<DFormFieldTypes.TextArea>;

type LongTextFieldProperties = StringFieldProperties<DFormFieldTypes.LongText>;

type FileFieldProperties = CommonFieldProperties<DFormFieldTypes.File>;

type BooleanFieldProperties = CommonFieldProperties<DFormFieldTypes.Boolean>;

type FileListFieldProperties = CommonFieldProperties<DFormFieldTypes.Boolean>;

interface ResourceFieldProperties extends CommonFieldProperties<DFormFieldTypes.Resource> {
  resourceCompileOption: ResourceCompileOptionTypes;
  resourceManagerFieldId: string;
}

interface HelpTextProperties extends CommonFieldProperties<DFormBlockTypes.HelpText> {
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
  readonly elementType: DFormElementTypes = DFormElementTypes.Block;
  /**
   * Indicates a unique identifier (ID) of an owning group.
   */
  groupId: string;
  /**
   * Indicates a field type.
   */
  type: DFormFieldTypes | DFormBlockTypes.HelpText = DFormFieldTypes.Text;
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
   * Indicates that the field is not yet, or no longer, relevant for users who are filling out the owning form.
   */
  isProtected: boolean = false;
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
  classes: DFormBlockSizeTypes = DFormBlockSizeTypes.Full;
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
  format: DFormDateFormatTypes;
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
  uiStyle: DFormMultiSelectUIStyles | null;
  /**
   * For field type DFormFieldTypes.Resource
   */
  resourceCompileOption: ResourceCompileOptionTypes;
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
    this.isLabelShowing = properties.isLabelShowing ?? this.isLabelShowing;
    this.masterSchemaFieldId = properties.masterSchemaFieldId ?? this.masterSchemaFieldId;
    this.classes = properties.classes ?? this.classes;
    this.conditions = properties.conditions ?? this.conditions;

    switch (properties.type) {
      case DFormFieldTypes.Text:
      case DFormFieldTypes.TextArea:
      case DFormFieldTypes.LongText:
        this.minLength = properties.minLength ?? this.minLength ?? null;
        this.maxLength = properties.maxLength ?? this.maxLength ?? null;
        break;
      case DFormFieldTypes.Date:
        this.format = properties.format ?? this.format ?? DFormDateFormatTypes.Date;
        break;
      case DFormFieldTypes.Number:
        this.minimum = properties.minimum ?? this.minimum ?? null;
        this.maximum = properties.maximum ?? this.maximum ?? null;
        break;
      case DFormFieldTypes.Select:
        this.options = properties.options ?? this.options ?? [];
        break;
      case DFormFieldTypes.MultiSelect:
        this.options = properties.options ?? this.options ?? [];
        this.uiStyle = properties.uiStyle ?? this.uiStyle ?? null;
        break;
      case DFormBlockTypes.HelpText:
        this.helpTextValue = properties.helpTextValue ?? this.helpTextValue ?? "New help text";
        break;
      case DFormFieldTypes.Resource:
        this.resourceCompileOption =
          properties.resourceCompileOption ??
          this.resourceCompileOption ??
          ResourceCompileOptionTypes.CompileOnOnboardingAssociation;
        this.resourceManagerFieldId = properties.resourceManagerFieldId ?? this.resourceManagerFieldId ?? null;
        break;
    }
  }
}
