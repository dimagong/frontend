import { OrganizationType } from "../models";

export const parseOrganizationType = (organizationType: OrganizationType) => {
  return organizationType.substr(4, organizationType.length).toLowerCase();
};
