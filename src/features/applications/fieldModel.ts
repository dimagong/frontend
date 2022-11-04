import { v4 } from "uuid";

import { FieldTypes } from "features/dform";
import { DFormElementTypes } from "features/dform/types";

import { AbstractDFormFieldConditionModel } from "./fieldConditionModel";
import { DateWidgetFormatTypes, FieldClassTypes, FieldUIStyles, ResourceCompileOptionTypes } from "./constants";

interface CommonFieldProperties<T extends FieldTypes> {
  id: string;
  type: T;
  title: string;
  groupId: string;
  classes: FieldClassTypes;
  isRequired: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId: string | number;
  conditions: AbstractDFormFieldConditionModel[];
}

interface StringFieldProperties<T extends FieldTypes> extends CommonFieldProperties<T> {
  minLength: number | null;
  maxLength: number | null;
}

interface DateFieldProperties extends CommonFieldProperties<FieldTypes.Date> {
  format: DateWidgetFormatTypes;
}

interface NumberFieldProperties extends CommonFieldProperties<FieldTypes.Number> {
  minimum: number | null;
  maximum: number | null;
}

interface SelectFieldProperties<T extends FieldTypes = FieldTypes.Select> extends CommonFieldProperties<T> {
  options: string[];
}

interface MultiSelectFieldProperties extends SelectFieldProperties<FieldTypes.MultiSelect> {
  uiStyle: FieldUIStyles | null;
}

type TextFieldProperties = StringFieldProperties<FieldTypes.Text>;

type TextAreaFieldProperties = StringFieldProperties<FieldTypes.TextArea>;

type LongTextFieldProperties = StringFieldProperties<FieldTypes.LongText>;

type FileFieldProperties = CommonFieldProperties<FieldTypes.File>;

type BooleanFieldProperties = CommonFieldProperties<FieldTypes.Boolean>;

type FileListFieldProperties = CommonFieldProperties<FieldTypes.Boolean>;

interface ResourceFieldProperties extends CommonFieldProperties<FieldTypes.Resource> {
  resourceCompileOption: ResourceCompileOptionTypes;
  resourceManagerFieldId: string;
}

interface HelpTextProperties extends CommonFieldProperties<FieldTypes.HelpText> {
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
  type: FieldTypes = FieldTypes.Text;
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
  classes: FieldClassTypes = FieldClassTypes.ColMd12;
  /**
   * Field conditions.
   */
  conditions: AbstractDFormFieldConditionModel[] = [];
  /**
   * For field type strings like FieldTypes.Text, FieldTypes.TextArea, and FieldTypes.LongText.
   */
  minLength: number | null;
  maxLength: number | null;
  /**
   * For field type FieldTypes.Date
   */
  format: DateWidgetFormatTypes;
  /**
   * For field type FieldTypes.Number
   */
  minimum: number | null;
  maximum: number | null;
  /**
   * For field type FieldTypes.Select and FieldTypes.MultiSelect
   */
  options: string[];
  /**
   * For field type FieldTypes.MultiSelect
   */
  uiStyle: FieldUIStyles | null;
  /**
   * For field type FieldTypes.Resource
   */
  resourceCompileOption: ResourceCompileOptionTypes;
  resourceManagerFieldId: string;
  /**
   * For field type FieldTypes.HelpText
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
      case FieldTypes.Text:
      case FieldTypes.TextArea:
      case FieldTypes.LongText:
        this.minLength = properties.minLength ?? this.minLength ?? null;
        this.maxLength = properties.maxLength ?? this.maxLength ?? null;
        break;
      case FieldTypes.Date:
        this.format = properties.format ?? this.format ?? DateWidgetFormatTypes.Date;
        break;
      case FieldTypes.Number:
        this.minimum = properties.minimum ?? this.minimum ?? null;
        this.maximum = properties.maximum ?? this.maximum ?? null;
        break;
      case FieldTypes.Select:
        this.options = properties.options ?? this.options ?? [];
        break;
      case FieldTypes.MultiSelect:
        this.options = properties.options ?? this.options ?? [];
        this.uiStyle = properties.uiStyle ?? this.uiStyle ?? null;
        break;
      case FieldTypes.HelpText:
        this.helpTextValue = properties.helpTextValue ?? this.helpTextValue ?? "New help text";
        break;
      case FieldTypes.Resource:
        this.resourceCompileOption =
          properties.resourceCompileOption ??
          this.resourceCompileOption ??
          ResourceCompileOptionTypes.CompileOnOnboardingAssociation;
        this.resourceManagerFieldId = properties.resourceManagerFieldId ?? this.resourceManagerFieldId ?? null;
        break;
    }
  }
}
