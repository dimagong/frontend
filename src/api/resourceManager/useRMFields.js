import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const RMFieldsQueryKey = "resource-manager-fields";

export const useRMFields = ({ organizationId, organizationType }, options = {}) => {
  return useQuery({
    queryKey: [RMFieldsQueryKey, { organizationId, organizationType }],
    queryFn: ({ signal }) =>
      clientAPI.get("/api/resource-manager-field/get-fields", {
        signal,
        params: {
          organization_id: organizationId,
          organization_type: organizationType,
        },
      }),
    enabled: [organizationId, organizationType].every(Boolean),
    ...options,
  });
};
