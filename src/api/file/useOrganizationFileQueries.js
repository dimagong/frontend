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
  brochure: (introPageId) => [...OrganizationFileQueryKeys.allBrochure(), introPageId],
};

export const useOrganizationLogoQuery = ({ organizationType, organizationId, isOnboarding }, options) => {
  const apiPrefix = isOnboarding ? "member-view-api" : "api";

  return useFileQuery(
    {
      url: `${apiPrefix}/files/organization/${organizationType}/${organizationId}/logo`,
      queryKey: OrganizationFileQueryKeys.logo(organizationType, organizationId),
    },
    options
  );
};

export const useOrganizationBrochureQuery = ({ introPageId }, options) => {
  return useFileQuery(
    {
      url: `api/files/organization-intro/${introPageId}/brochure`,
      queryKey: OrganizationFileQueryKeys.brochure(introPageId),
    },
    options
  );
};
