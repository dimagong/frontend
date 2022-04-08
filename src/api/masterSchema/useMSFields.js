import { useQuery } from "react-query";

import { getOrganizationType } from "constants/organization";

import { clientAPI } from "../clientAPI";

export const MSUserFieldsQueryKey = "master-schema-user-fields";

export const useMSFields = ({ organizationId, organizationType }, options = {}) => {
  return useQuery({
    queryKey: [MSUserFieldsQueryKey, { organizationId, organizationType }],
    queryFn: ({ signal }) =>
      clientAPI.get(`/api/master-schema-field`, {
        signal,
        params: {
          organization_id: organizationId,
          organization_type: getOrganizationType(organizationType),
        },
      }),
    enabled: [organizationId, organizationType].every(Boolean),
    ...options,
  });
};
