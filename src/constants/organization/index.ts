export enum OrganizationTypes {
  corporation = "corporation",
  network = "network",
}

enum AliasesOrganizationTypes {
  "App\\Corporation" = OrganizationTypes.corporation,
  "App\\Network" = OrganizationTypes.network,
}

export const getOrganizationType = (type: string): OrganizationTypes | string => {
  if (AliasesOrganizationTypes[type]) {
    return AliasesOrganizationTypes[type];
  }

  if (OrganizationTypes[type]) {
    return OrganizationTypes[type];
  }

  console.warn(`Organization type ${type} doesn't exist`);

  return type;
};
