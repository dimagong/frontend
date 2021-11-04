export const selectMasterSchemaFields = state => state?.app?.masterSchema.fields;
export const selectMasterSchemaOrganizations = state => state?.app?.masterSchema.organizations;

export const selectUnapprovedFieldsOfSelectedOrganization = state => {
  const selectedOrganizationIdAndType = state?.app?.masterSchema.selectedOrganization;
  const selectedOrganization = state?.app?.masterSchema.organizations.filter(org => (
    org.id === selectedOrganizationIdAndType.id && org.type === selectedOrganizationIdAndType.type
  ))[0];

  return selectedOrganization.master_schema.root.groups.filter(group => group.name === "Unapproved")[0].fields;
};
