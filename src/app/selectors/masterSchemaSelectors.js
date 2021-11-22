export const selectMasterSchemaFields = (state) => state?.app?.masterSchema.fields;
export const selectMasterSchemaOrganizations = (state) => state?.app?.masterSchema.organizations;

export const selectMasterSchemaOfSelectedOrganization = (state) => {
  const selectedOrganizationIdAndType = state?.app?.masterSchema.selectedOrganization;
  const selectedOrganization = state?.app?.masterSchema.organizations.filter(
    ({ id, type }) => id === selectedOrganizationIdAndType.id && type === selectedOrganizationIdAndType.type
  )[0];

  return selectedOrganization.masterSchema;
};

export const selectUnapprovedFieldsOfSelectedOrganization = (state) => {
  const selectedOrganizationMasterSchema = selectMasterSchemaOfSelectedOrganization(state);

  return selectedOrganizationMasterSchema.root.groups.filter((group) => group.name === "Unapproved")[0].fields;
};
