import { useQuery } from "react-query";

import { clientAPI } from "api/clientAPI";
import {normalizeHierarchy} from "api/masterSchema/normalizers";

export const MSHierarchyKey = "master-schema-hierarchy-by-user";

export const useMSHierarchy = ({ userId }, options) => {
  const {data, ...states} = useQuery({
    queryKey: [MSHierarchyKey, { userId }],
    queryFn: () =>
      clientAPI.get(`/api/master-schema/get-hierarchy-by-user`, {
        params: {
          user_id: userId,
          hidden_groups: [1],
          only_user_fields: 0,
        }
      }),
    ...options,
  });

  return {
    data: data ? normalizeHierarchy(data) : null,
    ...states
  }
};
