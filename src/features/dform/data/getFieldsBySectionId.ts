export const getFieldsBySectionId = (sectionId: string, { sections, groups, fields }) => {
  return sections[sectionId].relatedGroups
    .map((groupId) => groups[groupId].relatedFields)
    .flat()
    .map((fieldId) => fields[fieldId]);
};
