import { createQueryKey } from "api/createQueryKey";

import { useFileQuery } from "./useFileQueries";

export const OrganizationFileQueryKey = createQueryKey("Organization logo");

export const OrganizationFileQueryKeys = {
  all: () => [OrganizationFileQueryKey],

  allLogo: () => [...OrganizationFileQueryKeys.all(), "logo"],
  logo: (organizationType, organizationId) => [
    ...OrganizationFileQueryKeys.allLogo(),
    organizationType,
    organizationId,
  ],

  allBrochure: () => [...OrganizationFileQueryKeys.all(), "brochure"],
  brochure: (organizationType, organizationId) => [
    ...OrganizationFileQueryKeys.allBrochure(),
    organizationType,
    organizationId,
  ],
};

export const useOrganizationLogoQuery = ({ organizationType, organizationId }, options) => {
  return useFileQuery(
    {
      url: `api/files/organization/${organizationType}/${organizationId}/logo`,
      queryKey: OrganizationFileQueryKeys.logo(organizationType, organizationId),
    },
    options
  );
};

export const useOrganizationBrochureQuery = ({ organizationType, organizationId }, options) => {
  return useFileQuery(
    {
      url: `api/files/organization/${organizationType}/${organizationId}/brochure`,
      queryKey: OrganizationFileQueryKeys.brochure(organizationType, organizationId),
    },
    options
  );
};
