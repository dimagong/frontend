import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";

export const MSUserFieldsQueryKey = "master-schema-user-fields";

export const useMSFields = ({ organization_id, organization_type }, options = {}) => {
  return useQuery({
    queryKey: [MSUserFieldsQueryKey, { organization_id: !!organization_id, organization_type: !!organization_type }],
    queryFn: ({ signal }) =>
      clientAPI.get(`/api/master-schema-field`, {
        signal,
        params: {
          organization_id: organization_id,
          organization_type: organization_type,
        },
      }),
    ...options,
  });
};
