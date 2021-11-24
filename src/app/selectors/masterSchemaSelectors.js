export const selectMasterSchemaFields = (state) => state?.app?.masterSchema.fields;
export const selectMasterSchemaOrganizations = (state) => state?.app?.masterSchema.organizations;

export const selectSelectedOrganization = (state) => {
  return state?.app?.masterSchema.selectedOrganization;
};

export const selectMasterSchemaOfSelectedOrganization = (state) => {
  const selectedOrganizationIdAndType = selectSelectedOrganization(state);
  const selectedOrganization = state?.app?.masterSchema.organizations.filter(
    ({ id, type }) => id === selectedOrganizationIdAndType.id && type === selectedOrganizationIdAndType.type
  )[0];

  return selectedOrganization.masterSchema;
};

export const selectUnapprovedFieldsOfSelectedOrganization = (state) => {
  const selectedOrganizationMasterSchema = selectMasterSchemaOfSelectedOrganization(state);
  const unapproved = selectedOrganizationMasterSchema.root.children.find(({ name }) => name === "Unapproved");

  return selectedOrganizationMasterSchema.root.children.filter(({ key }) => unapproved.fields.includes(key));
};
