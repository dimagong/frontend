import {
  DFormSchema,
  DFormBlockTypes,
  DFormFieldTypes,
  NormalizedDFormSchema,
  NormalizedDFormGroupElement,
  NormalizedDFormBlockElement,
  NormalizedDFormSectionElement,
} from "../types";

const recognizeBlockType = (fieldType) => {
  switch (fieldType) {
    case "helpText":
      return DFormBlockTypes.HelpText;
    default:
      return DFormBlockTypes.Field;
  }
};

export const normalizeDFormSchema = (dformSchema: DFormSchema): NormalizedDFormSchema => {
  const sections: NormalizedDFormSectionElement[] = dformSchema.sectionsOrder.map(
    (sectionId) => dformSchema.sections[sectionId]
  );
  const groups: NormalizedDFormGroupElement[] = Object.values(dformSchema.groups).map((group) => ({
    ...group,
    relatedBlocks: group.relatedFields,
  }));
  const blocks: NormalizedDFormBlockElement[] = Object.values(dformSchema.fields).map((field) => ({
    id: field.id,
    label: field.title,
    format: field.format,
    groupId: field.groupId,
    options: field.options,
    uiStyle: field.uiStyle,
    isHidden: field.isHidden,
    ...(field.type === DFormBlockTypes.HelpText ? {} : { fieldType: field.type }),
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
