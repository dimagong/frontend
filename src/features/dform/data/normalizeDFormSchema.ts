import { DformBlockTypes } from "./models";

const recognizeBlockType = (fieldType) => {
  switch (fieldType) {
    case "helpText":
      return DformBlockTypes.HelpText;
    default:
      return DformBlockTypes.Field;
  }
};

export const normalizeDFormSchema = (dformSchema: any): any => {
  const sections = dformSchema.sectionsOrder.map((sectionId) => dformSchema.sections[sectionId]);
  const groups = Object.values(dformSchema.groups).map((group: any) => ({
    ...group,
    relatedBlocks: group.relatedFields,
  }));
  const blocks = Object.values(dformSchema.fields).map((field: any) => ({
    id: field.id,
    label: field.title,
    format: field.format,
    groupId: field.groupId,
    options: field.options,
    uiStyle: field.uiStyle,
    isHidden: field.isHidden,
    ...(field.type === DformBlockTypes.HelpText ? {} : { fieldType: field.type }),
    blockType: recognizeBlockType(field.type),
    blockSize: field.classes,
    isRequired: field.isRequired,
    isDisabled: field.isDisabled,
    isProtected: field.isProtected,
    isLabelShowing: field.isLabelShowing,
    masterSchemaFieldId: field.masterSchemaFieldId,

    resourceCompileOption: field.resourceCompileOption,
    resourceManagerFieldId: field.resourceManagerFieldId,

    helpText: field.helpTextValue,

    minLength: field.minLength,
    maxLength: field.maxLength,
    minimum: field.minimum,
    maximum: field.maximum,
    conditions: field.conditions,
  }));

  return { blocks, groups, sections };
};
