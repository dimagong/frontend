import { invariant } from "features/common";

import { AbstractService } from "./abstractService";
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
} from "../models";
import { DformBlockModel, DformFieldModel, DformFieldTypes, DformHelpTextModel } from "../models";

export class DformService extends AbstractService {
  readonly prefix = "/api";

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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
          field.masterSchemaFieldId
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
}
