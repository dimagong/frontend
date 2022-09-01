import { v4 } from "uuid";

import { ElementTypes, FieldTypes } from "components/DForm/constants";

import { DateWidgetFormatTypes, FieldClassTypes, FieldUIStyles } from "./constants";

export interface DFormFieldCondition {
  id: string;
  fieldId: string;
  effectType: string;
  operatorType: string;
  expectedValue: string | boolean | number | string[];
}

interface CommonFieldProperties<T extends FieldTypes> {
  id: string;
  type: T;
  title: string;
  groupId: string;
  classes: FieldClassTypes;
  isRequired: boolean;
  isDisabled: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId: string | number;
  conditions: DFormFieldCondition[];
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
  resourceCompileOption: string;
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

export abstract class AbstractDFormFieldModel {
  /**
   * An element type.
   */
  readonly elementType: ElementTypes = ElementTypes.Field;
  /**
   * An id of a group which contains that field.
   */
  groupId: string;
  /**
   * A type to determine field specific.
   */
  type: FieldTypes = FieldTypes.Text;
  /**
   * A title used as a label of a field.
   */
  title: string = "New Field";
  /**
   * Determines the needs to handle that field on submission.
   */
  isRequired: boolean = false;
  /**
   * A UI state of a field to lock/unlock field filling in.
   */
  isDisabled: boolean = false;
  /**
   * Determines the needs in UI to show/hide a field label.
   */
  isLabelShowing: boolean = true;
  /**
   * An id of a related master schema field.
   */
  masterSchemaFieldId: string | number;
  /**
   * A html class that will consume by field wrapper. Used to control a field layout.
   */
  classes: FieldClassTypes = FieldClassTypes.ColMd12;
  /**
   * An array of field dynamic conditional render conditions.
   */
  conditions: DFormFieldCondition[] = [];
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
  resourceCompileOption: string;
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
        this.helpTextValue = properties.helpTextValue ?? this.helpTextValue;
        break;
      // ToDo: Handle that case precisely
      case FieldTypes.Resource:
        this.resourceCompileOption = properties.resourceCompileOption ?? this.resourceCompileOption;
        this.resourceManagerFieldId = properties.resourceManagerFieldId ?? this.resourceManagerFieldId;
        break;
    }
  }
}
