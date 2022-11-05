import type { DFormSchema } from "../types";

export const getFieldsBySectionId = (sectionId: string, { sections, groups, fields }: DFormSchema) => {
  return sections[sectionId].relatedGroups
    .map((groupId) => groups[groupId].relatedFields)
    .flat()
    .map((fieldId) => fields[fieldId]);
};