import type { API_PREFIX_TYPE } from "features/common";
import { devWarning, AbstractService } from "features/common";

import {
  DformBlockTypes,
  DformGroupModel,
  DformSectionModel,
  DformDateFieldModel,
  DformBooleanFieldModel,
  DformFileFieldModel,
  DformFileListFieldModel,
  DformLongTextFieldModel,
  DformMultiSelectFieldModel,
  DformNumberFieldModel,
  DformResourceFieldModel,
  DformSelectFieldModel,
  DformTextFieldModel,
  DformTextAreaFieldModel,
  DformSchemaModel,
  DformFieldValueType,
} from "../models";
import { DformBlockModel, DformFieldModel, DformFieldTypes, DformHelpTextModel } from "../models";
import { DformModel } from "../models";

export class DformService extends AbstractService {
  readonly prefix: API_PREFIX_TYPE = "/api";

  private static recognizeBlockType(type: string): DformBlockTypes {
    switch (type) {
      case "helpText":
        return DformBlockTypes.HelpText;
      default:
        return DformBlockTypes.Field;
    }
  }

  private static parseField(field: any): DformFieldModel {
    const fieldType = field.type as DformFieldTypes;

    switch (fieldType) {
      case DformFieldTypes.Boolean:
        return new DformBooleanFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.Date:
        return new DformDateFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.format,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.File:
        return new DformFileFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.FileList:
        return new DformFileListFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.LongText:
        return new DformLongTextFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.minLength === null ? undefined : field.minLength,
          field.maxLength === null ? undefined : field.maxLength,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.MultiSelect:
        return new DformMultiSelectFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.uiStyle,
          field.options,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.Number:
        return new DformNumberFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.minimum === null ? undefined : field.minimum,
          field.maximum === null ? undefined : field.maximum,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.Resource:
        return new DformResourceFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.resourceCompileOption,
          field.resourceManagerFieldId,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.Select:
        return new DformSelectFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.options,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.Text:
        return new DformTextFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.minLength === null ? undefined : field.minLength,
          field.maxLength === null ? undefined : field.maxLength,
          Number(field.masterSchemaFieldId)
        );
      case DformFieldTypes.TextArea:
        return new DformTextAreaFieldModel(
          field.id,
          field.groupId,
          field.classes,
          field.conditions,
          field.isProtected,
          field.title,
          field.isRequired,
          field.isLabelShowing,
          field.minLength === null ? undefined : field.minLength,
          field.maxLength === null ? undefined : field.maxLength,
          Number(field.masterSchemaFieldId)
        );
    }
  }

  static parseBlock(block: any): DformBlockModel {
    const blockType = DformService.recognizeBlockType(block.type);

    switch (blockType) {
      case DformBlockTypes.Field:
        return DformService.parseField(block);
      case DformBlockTypes.HelpText:
        return new DformHelpTextModel(
          block.id,
          block.groupId,
          block.classes,
          block.conditions,
          block.isProtected,
          block.helpTextValue
        );
    }
  }

  static parseGroup(group: any): DformGroupModel {
    return new DformGroupModel(group.id, group.conditions, group.isProtected, group.name, group.relatedFields);
  }

  static parseSection(section: any): DformSectionModel {
    return new DformSectionModel(
      section.id,
      section.conditions,
      section.isProtected,
      section.name,
      section.isAlreadyViewed,
      section.relatedGroups
    );
  }

  static parseSchema(schema: any): DformSchemaModel {
    return new DformSchemaModel(
      Object.values(schema.fields).map(DformService.parseBlock),
      Object.values(schema.groups).map(DformService.parseGroup),
      Object.values(schema.sections).map(DformService.parseSection),
      schema.sectionsOrder
    );
  }

  static parseDform(dform: any): DformModel {
    return new DformModel(
      dform.id,
      dform.name,
      dform.status,
      DformService.parseSchema(dform.schema),
      dform.access_type,
      dform.is_viewed_sections
    );
  }

  static parseValue(value: any, fieldType: DformFieldTypes): DformFieldValueType {
    switch (fieldType) {
      case DformFieldTypes.Boolean:
        return typeof value.value === "boolean" ? value.value : undefined;
      case DformFieldTypes.Date:
      case DformFieldTypes.Text:
      case DformFieldTypes.Select:
      case DformFieldTypes.TextArea:
      case DformFieldTypes.LongText:
        return typeof value.value === "string" ? value.value : undefined;
      case DformFieldTypes.File:
      case DformFieldTypes.FileList:
      case DformFieldTypes.Resource:
        return value.files;
      case DformFieldTypes.MultiSelect:
        return Array.isArray(value.value) ? value.value : [];
      case DformFieldTypes.Number:
        return Number.isNaN(Number(value.value)) ? undefined : (Number(value.value) as any);
      default:
        return value.value;
    }
  }

  static parseValues(values: any, schema: DformSchemaModel): Record<string, DformFieldValueType> {
    if (!values) return {};
    return Object.fromEntries(
      Object.entries(values).map(([id, value]) => {
        const masterSchemaFieldId = Number(id);
        const field = schema.getFieldByMasterSchemaFieldId(masterSchemaFieldId);
        if (!field) {
          devWarning("Could not find field by value master schema field id.");
          return [undefined, undefined as unknown as DformFieldValueType];
        }
        return [field.id, DformService.parseValue(value, field.fieldType)];
      })
    );
  }
}
