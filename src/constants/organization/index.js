const organizationTypes = {
  [`App\\Corporation`]: "corporation",
  [`App\\Network`]: "network",
};
export const getOrganizationType = (type) => {
  if (!organizationTypes.hasOwnProperty(type)) {
    return type;
  }
  return organizationTypes[type];
};
