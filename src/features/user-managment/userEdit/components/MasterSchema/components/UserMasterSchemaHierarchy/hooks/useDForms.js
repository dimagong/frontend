import { useQuery } from "react-query";

import { clientAPI } from "api/clientAPI";

export const DFormsKey = "get-dForms";

export const useDForms = (options = {}) => {
  return useQuery({
    queryKey: [DFormsKey],
    queryFn: () => clientAPI.get(`/api/dform-template`),

    ...options,
  });
};
